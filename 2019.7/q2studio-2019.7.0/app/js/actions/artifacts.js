// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { remote } from 'electron';

import actions from './';
import { fetchAPI } from '../util/auth';

export const newArtifact = artifact => ({
    type: 'NEW_ARTIFACT',
    artifact
});

export const newVisualization = visualization => ({
    type: 'NEW_VISUALIZATION',
    visualization
});

export const newMetadata = metadata => ({
    type: 'NEW_METADATA',
    metadata
});

export const removedArtifact = uuid => ({
    type: 'DELETE_ARTIFACT',
    uuid
});

export const removedVisualization = uuid => ({
    type: 'DELETE_VISUALIZATION',
    uuid
});

export const clearArtifacts = () => ({
    type: 'CLEAR_ARTIFACTS'
});

export const clearVisualizations = () => ({
    type: 'CLEAR_VISUALIZATIONS'
});

export const clearMetadata = () => ({
    type: 'CLEAR_METADATA'
});

export const createArtifact = (formData) => {
    return (dispatch, getState) => {
        const { connection: { uri, secretKey } } = getState();
        fetchAPI(secretKey, 'POST', `http://${uri}/api/workspace/artifacts`, formData)
        .catch(({ message: error }) => alert(error))
        .then(() => dispatch(actions.refreshArtifacts()));
    };
};

export const exportArtifact = (artifact) => {
    return (dispatch, getState) => {
        remote.dialog.showSaveDialog({
            title: 'Choose Export Location',
            buttonlabel: 'Export',
            defaultPath: artifact.name
        }, (fps) => {
            if (fps) {
                const { connection: { uri, secretKey } } = getState();
                fetchAPI(secretKey, 'POST', `http://${uri}/api/workspace/artifacts/${artifact.uuid}`, { path: fps })
                .then(({ path }) => alert(`Succesfully exported data to:\n${path}`))
                .catch(({ message: error }) => alert(error));
            }
        });
    };
};

export const getVisualization = (vis) => {
    return (dispatch, getState) => {
        const { connection: { uri, secretKey } } = getState();
        fetchAPI(secretKey, 'GET', `http://${uri}/api/workspace/view/${vis.uuid}`)
        .then((json) => {
            const newVis = {
                ...vis,
                filePath: json.filePath
            };
            return dispatch(actions.registerPath(newVis));
        });
    };
};

export const deleteArtifact = (uuid) => {
    return (dispatch, getState) => {
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}/api/workspace/artifacts/${uuid}`;
        fetchAPI(secretKey, 'DELETE', url)
        .then(() => dispatch(removedArtifact(uuid)))
        .then(() => dispatch(actions.refreshValidation()));
    };
};

export const deleteVisualization = (uuid) => {
    return (dispatch, getState) => {
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}/api/workspace/visualizations/${uuid}`;
        fetchAPI(secretKey, 'DELETE', url)
        .then(() => {
            dispatch(removedVisualization(uuid));
        });
    };
};

export const refreshArtifacts = () => {
    return (dispatch, getState) => {
        dispatch(clearArtifacts());
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}/api/workspace/artifacts`;
        const method = 'GET';
        fetchAPI(secretKey, method, url)
        .then((json) => {
            json.artifacts.forEach(artifact => dispatch(newArtifact(artifact)));
        })
        .then(() => dispatch(actions.checkTypes()));
    };
};

export const refreshVisualizations = () => {
    return (dispatch, getState) => {
        dispatch(clearVisualizations());
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}/api/workspace/visualizations`;
        const method = 'GET';
        fetchAPI(secretKey, method, url)
        .then((json) => {
            json.visualizations.forEach(viz => dispatch(newVisualization(viz)));
        });
    };
};

export const refreshMetadata = () => {
    return (dispatch, getState) => {
        dispatch(clearMetadata());
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}/api/workspace/metadata`;
        fetchAPI(secretKey, 'GET', url)
        .then((json) => {
            json.metadata.forEach(entry => dispatch(newMetadata(entry)));
        });
    };
};
