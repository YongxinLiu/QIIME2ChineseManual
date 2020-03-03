// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { fetchAPI } from '../util/auth';

const clearWindowStateWithId = id => ({
    type: 'CLEAR_WINDOW_STATE',
    id
});

export const clearWindowState = (id) => {
    return (dispatch, getState) => {
        const { connection: { secretKey, uri }, windowState } = getState();
        if (windowState[id]) {
            const focusWindow = windowState[id];
            Object.keys(focusWindow).forEach((key) => {
                fetchAPI(secretKey, 'DELETE', `http://${uri}/api/workspace/view/${key}`);
            });
            dispatch(clearWindowStateWithId(id));
        }
        return true;
    };
};
