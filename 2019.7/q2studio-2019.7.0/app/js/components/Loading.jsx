// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';

import style from '../../css/Loading.css';

const Loading = ({ loaded, status }) => (
    loaded ?
        null :
        <div className={style.wrapper}>
            <div className={style.loaderBox}>
                <div className={style.loader} />
                <p className={style.label}>
                    { status }
                </p>
            </div>
        </div>
);

Loading.propTypes = {
    loaded: React.PropTypes.bool.isRequired,
    status: React.PropTypes.string.isRequired
};

export default Loading;
