// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';
import { shell } from 'electron';

import MetadataFile from './MetadataFile';

const Metadata = ({ metadata, dispatchDeleteMetadata }) => (
    <div>
        <table className="table">
            <thead>
                <tr>
                    <th>Filename</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {metadata.length ?
                    metadata.map(data => (
                        <MetadataFile
                            data={data}
                            deleteThis={() => {
                                if (confirm(
                                    'Are you sure you want to delete this metadata?')) {
                                    dispatchDeleteMetadata(data.filepath);
                                }
                            }}
                        />
                    )) : <tr><td>No available metadata...</td></tr>
                }
            </tbody>
        </table>
        <span>
            {/* TODO it would be neat to use the currently installed QIIME 2
              release variable (Python: `qiime2.__release__`) in the URL so
              that users can be linked directly to the metadata docs.
            */}
            Metadata files must match the QIIME 2 metadata requirements described at {' '}
            <a
                onClick={(e) => {
                    e.preventDefault();
                    shell.openExternal('https://docs.qiime2.org/');
                }}
            >docs.qiime2.org</a>. QIIME 2 metadata files can be validated with Keemei at {' '}
            <a
                onClick={(e) => {
                    e.preventDefault();
                    shell.openExternal('https://keemei.qiime2.org/');
                }}
            >keemei.qiime2.org</a>.
        </span>
    </div>
);

Metadata.propTypes = {
    metadata: React.PropTypes.array,
    dispatchDeleteMetadata: React.PropTypes.func
};

export default Metadata;
