// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';

const Directory = ({ path, dispatchChangeDirectory }) => (
    <div>
        <h2>Analysis Directory:</h2>
        <h4>{path}</h4>
        <button
            type="button"
            className="btn btn-primary pull-left"
            onClick={() => dispatchChangeDirectory(path)}
        >
            <span>Change Directory </span>
            <span className="glyphicon glyphicon-folder-open" />
        </button>
        <br />
        <br />
    </div>
);

Directory.propTypes = {
    path: React.PropTypes.string,
    dispatchChangeDirectory: React.PropTypes.func
};

export default Directory;
