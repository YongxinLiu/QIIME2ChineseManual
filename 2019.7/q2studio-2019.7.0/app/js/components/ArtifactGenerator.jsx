// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';
import ReactSelect from './ReactSelect';

const style = { verticalAlign: 'middle' };

const ArtifactGenerator = ({
    active,
    toggleCreation,
    createArtifact,
    selectDirectory,
    importableTypes,
    importableFormats,
    sysPath
}) => (
    <form onSubmit={e => createArtifact(e, active)}>
        <table className="table">
            <thead>
                <tr>
                    <th className="col-xs-1" />
                    <th className="col-xs-3" />
                    <th className="col-xs-2" />
                    <th className="col-xs-3" />
                    <th className="col-xs-3" />
                </tr>
            </thead>
            <tbody>
                { active === 0 ?
                    <tr>
                        <td><button
                            type="button"
                            className="btn btn-xs btn-success pull-left"
                            aria-label="Create Artifact"
                            onClick={() => toggleCreation(active)}
                        >
                            <span
                                style={{ color: 'white' }}
                                className="glyphicon glyphicon-plus"
                                aria-hidden="true"
                            />
                        </button></td>
                        <td />
                        <td />
                        <td />
                    </tr> :
                    <tr>
                        <td style={style}>
                            <button
                                type="button"
                                className="btn btn-xs btn-danger pull-left"
                                aria-label="Close Artifact Creation"
                                onClick={() => toggleCreation(active)}
                            >
                                <span
                                    style={{ color: 'white' }}
                                    className="glyphicon glyphicon-remove"
                                    aria-hidden="true"
                                />
                            </button>
                        </td>
                        <td style={style}>
                            <div className="input-group">
                                <span className="input-group-btn">
                                    <button
                                        type="button"
                                        className="btn btn-primary pull-left"
                                        onClick={selectDirectory}
                                    >
                                        <span
                                            className="glyphicon glyphicon-import"
                                        />
                                        <span> Import</span>
                                    </button>
                                </span>
                                <input
                                    name="path"
                                    type="text"
                                    className="form-control"
                                    style={{ width: '100%' }}
                                    placeholder="Data Directory Path"
                                    value={sysPath || ''}
                                />
                            </div>
                        </td>
                        <td style={style}>
                            <input
                                name="name"
                                type="text"
                                className="form-control"
                                placeholder="Name"
                            />
                        </td>
                        <td style={style}>
                            <ReactSelect
                                name="source_format"
                                placeholder="Source Format (optional)"
                                options={importableFormats}
                            />
                        </td>
                        <td style={style}>
                            <div className="input-group">
                                <ReactSelect
                                    name="type"
                                    placeholder="Semantic Type"
                                    options={importableTypes}
                                />
                                <span className="input-group-btn">
                                    <button type="submit" className="btn btn-success">
                                    Go!
                                    </button>
                                </span>
                            </div>
                        </td>
                    </tr>
        }
            </tbody>
        </table>
    </form>
);


ArtifactGenerator.propTypes = {
    active: React.PropTypes.number,
    toggleCreation: React.PropTypes.func,
    importableTypes: React.PropTypes.array,
    importableFormats: React.PropTypes.array,
    sysPath: React.PropTypes.string,
    selectDirectory: React.PropTypes.func,
    createArtifact: React.PropTypes.func
};

export default ArtifactGenerator;
