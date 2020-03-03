// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';

import style from '../../css/JobHistory.css';

const JobHistoryData = ({ name, value }) => (
    name !== undefined && value !== undefined && value !== null ?
        <tr className={name === 'stderr' && value.length > 0 ? 'danger' : ''}>
            <td className="col-sm-3">{name}</td>
            <td className={style.td} style={{ whiteSpace: 'pre' }}>
                {typeof value === 'object' ?
                     Object.keys(value).map(key => `${key}: ${value[key]}\n`) :
                     `${value}`
                }
            </td>
        </tr> :
    null
);

JobHistoryData.propTypes = {
    name: React.PropTypes.string,
    value: React.PropTypes.any
};

export default JobHistoryData;
