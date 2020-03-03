// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';

import Workflow from './Workflow';

const Workflows = ({ plugin, listing, openWorkflow }) => (
    <div>
        { listing.map(action => (
            <Workflow
                key={action.name}
                flow={action}
                disabled={action.requires.length !== 0}
                onClick={() => openWorkflow(plugin, action)}
            />
        ))}
    </div>
);


Workflows.propTypes = {
    openWorkflow: React.PropTypes.func,
    plugin: React.PropTypes.string,
    listing: React.PropTypes.array
};

export default Workflows;
