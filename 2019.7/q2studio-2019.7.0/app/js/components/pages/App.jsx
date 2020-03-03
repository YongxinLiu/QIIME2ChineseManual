// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';

import ArtifactsList from '../../containers/ArtifactsList';
import PluginsList from '../../containers/PluginsList';
import Directory from '../../containers/Directory';
import JobList from '../../containers/JobList';

const App = () => (
    <div>
        <div className="container">
            <div className="page-header">
                <Directory />
            </div>
            <PluginsList />
            <br />
            <JobList />
            <ArtifactsList />
        </div>
    </div>
);

export default App;
