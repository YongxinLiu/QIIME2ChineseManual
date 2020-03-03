// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import CryptoJS from 'crypto-js';

const makeB64Digest = (secretKey, httpVerb, url, requestTime, body) => {
    const byteArray = CryptoJS.enc.Base64.parse(secretKey);
    const message = [
        httpVerb,
        url,
        requestTime,
        'application/json',
        (body || '')
    ];

    if (body !== undefined) { message.push(body.length); }

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, byteArray);
    message.forEach((value) => {
        hmac.update(value.toString());
    });
    const hash = hmac.finalize().toString(CryptoJS.enc.Base64);

    return hash;
};

export const fetchAPI = (secretKey, method, url, body_) => {
    const timestamp = Date.now();
    const body = JSON.stringify(body_);
    const digest = makeB64Digest(secretKey, method, url, timestamp, body);
    return fetch(url, {
        method,
        headers: new Headers({
            Authorization: `HMAC-SHA256 ${digest}`,
            'Content-Type': 'application/json',
            'X-QIIME-Timestamp': timestamp
        }),
        body: (body || undefined)
    })
    .then((response) => {
        const parsed = response.text().then(value => (value ? JSON.parse(value) : {}));
        if (!response.ok) {
            return parsed.then((json) => {
                throw Error(`${response.statusText} - ${json.error}`);
            });
        }
        return parsed;
    });
};
