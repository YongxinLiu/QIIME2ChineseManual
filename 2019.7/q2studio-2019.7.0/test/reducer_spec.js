// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

/* eslint-disable no-unused-expressions*/
/* global describe it */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

import reducer from '../app/js/reducers';
import actions from '../app/js/actions';

const doNothingAction = {
    type: 'DO_NOTHING'
};

describe('reducer', () => {
    it('contains a plugins reducer', () => {
        const state = reducer(undefined, doNothingAction);
        expect(state).to.include.key('plugins');
    });

    it('contains an artifacts reducer', () => {
        const state = reducer(undefined, doNothingAction);
        expect(state).to.include.key('artifacts');
    });

    it('contains a connection reducer', () => {
        const state = reducer(undefined, doNothingAction);
        expect(state).to.include.key('connection');
    });

    it('contains a jobs reducer', () => {
        const state = reducer(undefined, doNothingAction);
        expect(state).to.include.key('jobs');
    });

    it('handles NEW_ARTIFACT', () => {
        const artifact = {
            name: 'table',
            uuid: 'f16ca3d0-fe83-4b1e-8eea-7e35db3f6b0f',
            type: 'FeatureTable[Frequency]'
        };
        const action = actions.newArtifact(artifact);
        const state = reducer(undefined, action);

        expect(state.artifacts.artifacts).to.not.be.empty;
        expect(state.artifacts.artifacts).includes.something.that.eql(artifact);
    });

    it('handles DELETE_ARTIFACT', () => {
        const initialState = reducer(undefined, doNothingAction);
        const artifact = {
            name: 'table',
            uuid: 'f16ca3d0-fe83-4b1e-8eea-7e35db3f6b0f',
            type: 'FeatureTable[Frequency]'
        };
        let action = actions.newArtifact(artifact);
        const state = reducer(initialState, action);
        action = actions.removedArtifact(artifact.uuid);

        deepFreeze(state);
        const nextState = reducer(state, action);
        expect(nextState.artifacts.artifacts).to.not.include.something.that.eql(artifact);
        expect(nextState.artifacts.artifacts).to.be.empty;
    });

    it('handles CLEAR_ARTIFACTS', () => {
        const state = {
            artifacts: {
                artifacts: [{ name: 'Fake Artifact' }],
                visualizations: [{ name: 'Fake Visualization' }]
            }
        };
        const nextState = reducer(state, actions.clearArtifacts());
        expect(nextState.artifacts.artifacts).to.be.empty;
        expect(nextState.artifacts.visualizations).to.not.be.empty;
    });

    it('handles ESTABLISH_CONNECTION', () => {
        const uri = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        const secretKey = 'abc123';
        const action = {
            type: 'ESTABLISH_CONNECTION',
            uri,
            secretKey
        };
        const nextState = reducer(undefined, action);
        expect(nextState.connection.uri).to.equal(uri);
        expect(nextState.connection.secretKey).to.equal(secretKey);
    });

    it('handles NEW_ACTIVE_JOB', () => {
        const job = { id: 12345 };
        const state = reducer(undefined, actions.newActiveJob(job));
        expect(state.jobs.activeJobs).to.not.be.empty;
        expect(state.jobs.activeJobs).to.include.something.that.eql(job);
    });

    it('handles JOB_COMPLETED', () => {
        const job = { uuid: 12345 };
        const state = {
            jobs: {
                activeJobs: [
                    job
                ],
                failedJobs: [],
                completedJobs: []
            }
        };
        const nextState = reducer(state, actions.jobCompleted({
            job: { job: { ...job }, error: false },
            uuid: job.uuid
        }));
        expect(nextState.jobs.activeJobs).to.not.include.something.eql(job);
    });

    it('handles CLEAR_JOB_STATE', () => {
        const state = {
            currentJob: {
                table: [{ name: 'test' }]
            }
        };
        const nextState = reducer(state, actions.clearJobState());
        expect(nextState.currentJob).to.eql({});
    });

    it('handles LINK_INPUT_ARTIFACT', () => {
        const artifacts = [{ name: 'fake artifact' }];
        const state = reducer(undefined, actions.linkInputArtifact('table', artifacts));
        expect(state.currentJob).to.include.key('table');
        expect(state.currentJob.table).to.eql(artifacts);
    });

    it('handles FOUND_PLUGIN', () => {
        const plugin = {
            name: 'Test Plugin',
            methods: [],
            visualizers: []
        };
        const action = {
            type: 'FOUND_PLUGIN',
            plugin
        };
        const state = reducer(undefined, action);
        expect(state.plugins).to.not.be.empty;
        expect(state.plugins).to.include.something.eql(plugin);
    });

    it('handles FOUND_METHOD', () => {
        const initialState = {
            plugins: [{
                name: 'diversity',
                methods: [],
                visualizations: []
            }]
        };
        const expectedState = {
            name: 'diversity',
            methods: [{
                name: 'Beta diversity',
                requires: []
            }],
            visualizations: []
        };

        const state = reducer(initialState, doNothingAction);
        const action = {
            type: 'FOUND_METHOD',
            plugin: 'diversity',
            method: {
                name: 'Beta diversity'
                // Many more things, but we just want to make sure the object
                // is attached
            }
        };

        deepFreeze(state);
        const nextState = reducer(state, action);
        expect(nextState.plugins).to.include.something.that.eql(expectedState);
    });
});
