// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

const initialState = {
    artifacts: [],
    visualizations: [],
    metadata: [],
    sysCreationPath: undefined
};

const artifactsReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'NEW_ARTIFACT': {
        const { artifact } = action;
        if (state.artifacts.find(a => a.uuid === artifact.uuid) === undefined) {
            const newState = {
                ...state,
                artifacts: [
                    ...state.artifacts,
                    artifact
                ]
            };
            return newState;
        }
        return state;
    }
    case 'NEW_VISUALIZATION': {
        const { visualization } = action;
        if (state.visualizations.find(v => v.uuid === visualization.uuid) === undefined) {
            const newState = {
                ...state,
                visualizations: [
                    ...state.visualizations,
                    visualization
                ]
            };
            return newState;
        }
        return state;
    }
    case 'NEW_METADATA': {
        const { metadata } = action;
        if (state.metadata.find(m => m.filepath === metadata.filepath) === undefined) {
            const newState = {
                ...state,
                metadata: [
                    ...state.metadata,
                    metadata
                ]
            };
            return newState;
        }
        return state;
    }
    case 'DELETE_ARTIFACT': {
        return {
            ...state,
            artifacts: [
                ...state.artifacts.filter(a => a.uuid !== action.uuid)
            ]
        };
    }
    case 'DELETE_VISUALIZATION': {
        return {
            ...state,
            visualizations: [
                ...state.visualizations.filter(v => v.uuid !== action.uuid)
            ]
        };
    }
    case 'CLEAR_ARTIFACTS': {
        return {
            ...state,
            artifacts: []
        };
    }
    case 'CLEAR_VISUALIZATIONS': {
        return {
            ...state,
            visualizations: []
        };
    }
    case 'CLEAR_METADATA': {
        return {
            ...state,
            metadata: []
        };
    }
    case 'SET_ARTIFACT_PATH': {
        return {
            ...state,
            sysCreationPath: action.path
        };
    }
    case 'CHANGE_TAB': {
        if (action.name !== 'createArtifact') { return state; }
        return {
            ...state,
            sysCreationPath: undefined
        };
    }
    default:
        return state;
    }
};

export default artifactsReducer;
