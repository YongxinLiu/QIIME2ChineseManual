// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

const initialState = {};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case 'CLEAR_WINDOW_STATE': {
        const newState = { ...state };
        delete newState[action.id];
        return newState;
    }
    case 'REGISTER_PATH': {
        const newState = { ...state };
        newState[action.source] = (newState[action.source] || {});
        newState[action.source][action.visualization.uuid] = action.visualization;
        return newState;
    }
    default: return state;
    }
};

export default reducer;
