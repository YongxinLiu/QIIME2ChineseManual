// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';
import { ipcRenderer as ipc } from 'electron';

import Artifact from './Artifact';
import ArtifactGenerator from '../containers/ArtifactGenerator';

const Artifacts = ({ data, type, dispatchDeleteArtifact, dispatchDeleteVisualization }) => (
    <div>
        <table className="table">
            <thead>
                <tr>
                    <th className="col-xs-3">Name</th>
                    <th className="col-xs-5">UUID</th>
                    <th className="col-xs-2">Type</th>
                    <th className="col-xs-2" />
                </tr>
            </thead>
            <tbody>
                {data.length ? (
                    data.map(item => (
                        <Artifact
                            key={item.uuid}
                            data={item}
                            onClick={() => ipc.send('open-new-page', {
                                url: `artifact/${item.uuid}`
                            })}
                            deleteThis={() => {
                                if (confirm('Are you sure you want to delete this Artifact?')) {
                                    if (type === 'artifact') {
                                        dispatchDeleteArtifact(item.uuid);
                                    } else if (type === 'visualization') {
                                        dispatchDeleteVisualization(item.uuid);
                                    } else {
                                        throw Error(`Unkown type '${type}'`);
                                    }
                                }
                            }}
                        />
                    ))) : (<tr><td>{`No available ${type}s...`}</td></tr>)
                }
            </tbody>
        </table>
        { type === 'artifact' ? <ArtifactGenerator /> : null }
    </div>
);

Artifacts.propTypes = {
    data: React.PropTypes.array,
    type: React.PropTypes.string,
    dispatchDeleteArtifact: React.PropTypes.func,
    dispatchDeleteVisualization: React.PropTypes.func
};

export default Artifacts;
