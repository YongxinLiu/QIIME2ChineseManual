// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { remote } from 'electron';

import actions from '../actions';
import Job from '../components/pages/Job';

const mapStateToProps = (state, { params: { pluginId, jobId, actionType, uuid } }) => {
    const { currentJob: inputs, artifacts: { metadata } } = state;
    const plugin = state.plugins.find(p => p.name === pluginId);
    const action = plugin[actionType].find(w => w.id === jobId);
    const active = state.jobs.activeJobs.find(j => j.uuid === uuid);
    return ({
        action,
        actionType,
        inputs,
        active,
        metadata
    });
};

const mapDispatchToProps = (dispatch, { router, params: { pluginId, jobId, actionType } }) => ({
    submitJob: (e, parameters) => {
        e.preventDefault();
        const booleans = parameters.filter(param => param.type === 'Bool');
        const formData = new FormData(e.target);
        const job = {
            inputs: {},
            parameters: {},
            outputs: {},
            action: jobId,
            plugin: pluginId,
            actionType
        };
        let catbuffer = [];
        for (const [key, value] of formData.entries()) {
            const [type, name, required] = key.split('-');
            if (value.trim().length === 0 && (required || type === 'out')) {
                alert(`Please provide a value for ${name} (must not be blank).`);
                return;
            }
            switch (type) {
            case 'in':
                job.inputs[name] = value;
                break;
            case 'param':
                if (booleans.find(bool => bool.name === name) && value === 'on') {
                    job.parameters[name] = 'true';
                } else {
                    job.parameters[name] = !required && value === '' ? null : value;
                }
                break;
            case 'out':
                job.outputs[name] = value;
                break;
            case 'metadata':
                job.parameters[name] = value;
                break;
            case 'metadatacat1':
                // TODO: FIX ALL OF THIS.
                catbuffer = [];
                catbuffer.push(value);
                break;
            case 'metadatacat2':
                catbuffer.push(value);
                job.parameters[name] = catbuffer;
                break;
            default:
                break;
            }
        }
        for (const bool of booleans) {
            if (!job.parameters[bool.name]) {
                job.parameters[bool.name] = 'false';
            }
        }
        dispatch(actions.startJob(job))
        .then((jobJSON) => {
            if (actionType !== 'methods') {
                const uri = `job/${pluginId}/${actionType}/${jobId}`;
                dispatch(actions.watchForVisualization(jobJSON.uuid, router, uri));
                router.push(`${uri}/running/${jobJSON.uuid}`);
            }
        })
        .catch(({ message: error }) => {
            alert(error);
        });
        if (actionType === 'methods') { router.push('/'); }
    },
    cancelJob: () => {
        if (actionType === 'methods') {
            router.goBack();
        } else {
            remote.getCurrentWindow().close();
        }
        dispatch(actions.clearJobState());
    }
});


export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Job)
);
