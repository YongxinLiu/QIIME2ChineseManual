// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';
import moment from 'moment';

import Timer from './Timer';


const JobRow = ({ data, onClick }) => (
    <tr>
        <td>
            <a style={{ cursor: 'pointer' }} onClick={onClick}>
                { data.actionName }
            </a>
        </td>
        <td>
            { moment(data.started).format('YY-MM-DD hh:mm:ss') }
        </td>
        {data.finished ?
            <td>
                { moment(data.finished).format('YY-MM-DD hh:mm:ss') }
            </td>
            :
            <td>
                <Timer start={data.started} />
            </td>
    }
    </tr>
);

JobRow.propTypes = {
    data: React.PropTypes.object,
    onClick: React.PropTypes.func
};

export default JobRow;
