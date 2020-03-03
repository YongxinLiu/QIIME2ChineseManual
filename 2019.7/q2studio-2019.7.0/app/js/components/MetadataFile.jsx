// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';

const MetadataFile = ({ data }) => (
    <tr key={data.filepath}>
        <td>
            { data.name }
        </td>
        <td />
    </tr>
);

MetadataFile.propTypes = {
    data: React.PropTypes.object
};

export default MetadataFile;
