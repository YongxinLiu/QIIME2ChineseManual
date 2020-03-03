// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

// remote.app.getPath('home') breaks redux-electron-store/webpack as the
// renderer side is trying to be imported into the main process code
const initialState = '';

const directoryReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'DIRECTORY_CHANGE': {
        return action.directory;
    }
    default:
        return state;
    }
};

export default directoryReducer;
