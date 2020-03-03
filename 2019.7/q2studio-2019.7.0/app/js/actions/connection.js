// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { remote } from 'electron';

import actions from './';


const establishConnectionHidden = (uri, secretKey) => ({
    type: 'ESTABLISH_CONNECTION',
    uri,
    secretKey
});


export const establishConnection = (uri, secretKey) => {
    return (dispatch) => {
        dispatch(establishConnectionHidden(uri, secretKey));
        dispatch(actions.loadPlugins());
        dispatch(actions.directoryChange(remote.app.getPath('home')));
        dispatch(actions.checkImportableTypes());
        dispatch(actions.checkImportableFormats());
    };
};
