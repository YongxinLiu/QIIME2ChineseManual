// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';

import JobHistoryData from './JobHistoryData';
import Visualization from '../containers/Visualization';

class ArtifactDetail extends React.Component {
    constructor(props) {
        super(props);
        this.order = ['UUID', 'Type'];
    }
    componentDidMount() {
        if (this.props.artifact.type === 'Visualization') {
            this.props.getVisualization(this.props.artifact);
        }
    }

    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>{this.props.artifact.name}</h1>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Detail View:
                    </div>
                    <div className="panel-body">
                        <table className="table">
                            <tbody>
                                {this.order.map(key =>
                                    <JobHistoryData
                                        key={key}
                                        name={key}
                                        value={this.props.artifact[key.toLowerCase()]}
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                { this.props.artifact.type === 'Visualization' ?
                    <Visualization {...this.props} /> :
                    <button
                        className="btn btn-primary pull-right"
                        onClick={() => this.props.exportArtifact(this.props.artifact)}
                    >
                        <span className="glyphicon glyphicon-export" /> Export
                    </button>
                }
            </div>);
    }
}

ArtifactDetail.propTypes = {
    artifact: React.PropTypes.object,
    getVisualization: React.PropTypes.func,
    exportArtifact: React.PropTypes.func
};

export default ArtifactDetail;
