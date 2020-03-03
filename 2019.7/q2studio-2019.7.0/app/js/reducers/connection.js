// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

const initialState = {};

const connectionReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'ESTABLISH_CONNECTION': {
        const newState = {
            ...state,
            uri: action.uri,
            secretKey: action.secretKey
        };
        return newState;
    }
    default:
        return state;
    }
};

export default connectionReducer;
