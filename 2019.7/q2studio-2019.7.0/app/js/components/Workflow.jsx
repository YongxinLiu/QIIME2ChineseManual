// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';

const Workflow = ({ flow, onClick, disabled }) => (
    <button
        type="button" disabled={disabled} className="list-group-item"
        style={{ backgroundColor: disabled ? '#f9f9f9' : '' }} onClick={onClick}
    >
        <span className="col-lg-4 col-md-4 col-sm-5 col-xs-5">
            { flow.name }
        </span>
        <span className="col-lg-4 col-md-4 col-sm-2 col-xs-2">
            {disabled ?
                <span>
                    <span className="visible-lg-block visible-md-block">
                        {`Requires: ${flow.requires.join(', ')}`}
                    </span>
                    <span
                        className="glyphicon glyphicon-warning-sign pull-right
                               visible-sm-block visible-xs-block"
                        title={`Requires: ${flow.requires.join(', ')}`}
                        aria-hidden="true"
                    />
                </span> : null
        }
        </span>
        <span className="col-lg-4 col-md-4 col-sm-5 col-xs-5">
            Produces: { flow.outputs.map(({ type }) => type).join(', ') }
        </span>
    </button>
);

Workflow.propTypes = {
    flow: React.PropTypes.object,
    onClick: React.PropTypes.func,
    disabled: React.PropTypes.bool
};

export default Workflow;
