// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { fetchAPI } from '../util/auth';

export const importFormats = importableFormatsList => ({
    type: 'IMPORTABLE_FORMATS',
    importableFormatsList
});

export const checkImportableFormats = () => {
    return (dispatch, getState) => {
        const {
            connection: { uri, secretKey }
        } = getState();
        const url = `http://${uri}/api/formats/importable`;
        // TODO: don't hit the server if there is nothing new to ask...
        fetchAPI(secretKey, 'POST', url)
        .then(json => dispatch(importFormats(json)));
    };
};
