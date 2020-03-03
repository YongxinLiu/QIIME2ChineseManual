// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import actions from '../actions';
import { fetchAPI } from '../util/auth';

// global variable to set and clear intervals for scanning for jobs.
let jobInterval;

export const newActiveJob = job => ({
    type: 'NEW_ACTIVE_JOB',
    job
});

export const jobCompleted = job => ({
    type: 'JOB_COMPLETED',
    job
});

export const registerPath = visualization => ({
    type: 'REGISTER_PATH',
    visualization
});

export const watchForVisualization = (jobUUID, router, url) => {
    return (dispatch, getState) => {
        const { connection: { secretKey, uri } } = getState();
        const update = () => {
            const job = getState().jobs.completedJobs.find(j => j.uuid === jobUUID);
            if (job) {
                const visUUID = job.outputs.visualization;
                let vis = getState().artifacts.visualizations.find(v => v.uuid === visUUID);
                if (!vis) {
                    setTimeout(update, 1000);
                    return;
                }
                fetchAPI(secretKey, 'GET', `http://${uri}/api/workspace/view/${vis.uuid}`)
                .then((json) => {
                    vis = {
                        ...vis,
                        filePath: json.filePath
                    };
                    return dispatch(actions.registerPath(vis));
                })
                .then(action => router.push(`${url}/${action.visualization.uuid}`));
            } else {
                setTimeout(update, 1000);
            }
        };
        update();
    };
};

const pollJobStatus = (dispatch, getState) => {
    const { connection: { uri, secretKey }, jobs: { activeJobs } } = getState();
    activeJobs.forEach((job) => {
        fetchAPI(secretKey, 'GET', `http://${uri}/api/jobs/${job.uuid}`)
        .then((json) => {
            if (json.completed) {
                dispatch(jobCompleted(json));
                dispatch(actions.refreshArtifacts());
                dispatch(actions.refreshVisualizations());
            }
        });
    });
};

export const startJob = (data) => {
    return (dispatch, getState) => {
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}/api/jobs/`;
        return fetchAPI(secretKey, 'POST', url, data)
        .then(({ job }) => fetchAPI(secretKey, 'GET', `http://${uri}${job}`))
        .then((json) => {
            dispatch(actions.newActiveJob(json));
            if (jobInterval === undefined) {
                jobInterval = setInterval(() => pollJobStatus(dispatch, getState), 1000);
            }
            return json;
        });
    };
};


export const clearJobState = () => ({
    type: 'CLEAR_JOB_STATE'
});

export const linkInputArtifact = (input, artifacts) => ({
    type: 'LINK_INPUT_ARTIFACT',
    input,
    artifacts
});

export const setJob = (action) => {
    return (dispatch, getState) => {
        const {
            artifacts: { artifacts },
            superTypes: { yes }
        } = getState();
        action.inputs.forEach(({ type, name }) => {
            const subtypes = yes[type];
            dispatch(linkInputArtifact(name, artifacts.filter(
                ({ type: atype }) => subtypes.has(atype))));
        });
    };
};
