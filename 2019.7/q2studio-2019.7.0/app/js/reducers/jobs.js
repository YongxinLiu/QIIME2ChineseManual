// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

const initialState = {
    activeJobs: [],
    completedJobs: [],
    failedJobs: []
};

const jobReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'NEW_ACTIVE_JOB': {
        const newState = {
            ...state,
            activeJobs: [
                ...state.activeJobs,
                action.job
            ]
        };
        return newState;
    }
    case 'JOB_COMPLETED': {
        const newState = {
            ...state,
            activeJobs: [
                ...state.activeJobs.filter(a => a.uuid !== action.job.uuid)
            ]
        };

        if (action.job.error) {
            newState.failedJobs = [
                ...state.failedJobs.filter(a => a.uuid !== action.job.uuid),
                action.job
            ];
        } else {
            newState.completedJobs = [
                ...state.completedJobs.filter(a => a.uuid !== action.job.uuid),
                action.job
            ];
        }

        return newState;
    }
    default:
        return state;
    }
};

export default jobReducer;
