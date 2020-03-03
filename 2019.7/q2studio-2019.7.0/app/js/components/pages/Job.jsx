// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';

import _ from 'lodash';


const Job = ({ action, inputs, metadata, submitJob, cancelJob, children }) => {
    let counter = 1;
    return (
        <div className="container">
            <div className="page-header">
                <h1>{action.name}</h1>
                <h4>{action.description}</h4>
            </div>
            <form onSubmit={e => submitJob(e, action.parameters)}>
                { action.inputs.map(({ name, required }) =>
                    <fieldset
                        className="form-group"
                        key={`${name}-dropdown${counter++}`}
                    >
                        <label htmlFor={`in-${name}${required ? '-required' : ''}`}>
                        Input Artifact: { name }
                        </label>
                        <select
                            className="form-control"
                            name={`in-${name}${required ? '-required' : ''}`}
                        >
                            { !required &&
                                <option
                                    key={null}
                                    value=""
                                >
                                    No Artifact
                                </option>
                            }
                            { inputs[name] !== undefined ?
                            inputs[name].map(artifact =>
                                <option
                                    key={artifact.uuid}
                                    value={artifact.uuid}
                                >
                                    {artifact.name} - {`(${artifact.uuid})`}
                                </option>
                            ) : null
                        }
                        </select>
                    </fieldset>
            )}

                { action.parameters.map(({ name, type, ast, required, default: def }) =>
                    <fieldset
                        className="form-group"
                        key={`${name}-text-input${counter++}`}
                    >
                        <label htmlFor={`param-${name}${required ? '-required' : ''}`}>
                        Input Parameter: { name }
                        </label>
                        { ast.predicate && ast.predicate.name === 'Choices' ?
                        (
                            <select
                                className="form-control"
                                name={`param-${name}${required ? '-required' : ''}`}
                            >
                                { !required && def === null &&
                                    <option
                                        key={null}
                                        value=""
                                    >
                                        None
                                    </option>
                                }
                                {
                                _.sortBy(ast.predicate.choices).map(choice =>
                                    <option
                                        selected={choice === def}
                                        key={choice}
                                        value={choice}
                                    >
                                        {choice}
                                    </option>
                                )
                            }
                            </select>
                        )
                        : type === 'Metadata' ?
                        (
                            <select
                                className="form-control"
                                name={`metadata-${name}${required ? '-required' : ''}`}
                            >
                                { !required &&
                                    <option
                                        key={null}
                                        value=""
                                    >
                                        No Metadata
                                    </option>
                                }
                                { metadata ?
                                    metadata.map(entry =>
                                        <option
                                            key={entry.name}
                                            value={entry.filepath}
                                        >
                                            {entry.name}
                                        </option>
                                    ) : null
                                }
                            </select>
                        )
                        /* TODO how should unsupported MetadataColumn type
                           expressions be handled here? On the Python side
                           (`q2studio.api.jobs`), an error is raised if an
                           unsupported MetadataColumn type expression is
                           detected. Here, any type expression string starting
                           with 'MetadataColumn' is assumed to be valid.
                        */
                        : type.startsWith('MetadataColumn') ?
                        (
                            <fieldset>
                                <select
                                    className="form-control"
                                    name={`metadatacat1-${name}${required ? '-required' : ''}`}
                                >
                                    { !required &&
                                        <option
                                            key={null}
                                            value=""
                                        >
                                            No Metadata
                                        </option>
                                    }
                                    { metadata ?
                                        metadata.map(entry =>
                                            <option
                                                key={entry.name}
                                                value={entry.filepath}
                                            >
                                                {entry.name}
                                            </option>
                                        ) : null
                                    }
                                </select>
                                <input
                                    type="text-field"
                                    className="form-control"
                                    name={`metadatacat2-${name}${required ? '-required' : ''}`}
                                    placeholder={`${type}${required ? '' : ' (optional)'}`}
                                />
                            </fieldset>
                        )
                        : type === 'Bool' ?
                            <div className="checkbox">
                                <label htmlFor={`param-${name}${required ? '-required' : ''}`}>
                                    <input
                                        type="checkbox"
                                        name={`param-${name}${required ? '-required' : ''}`}
                                        defaultChecked={def}
                                    />{name}
                                </label>
                            </div>
                        :
                        (
                            <input
                                type="text-field"
                                className="form-control"
                                name={`param-${name}${required ? '-required' : ''}`}
                                placeholder={`${type}${required ? '' : ' (optional)'}`}
                                defaultValue={def}
                            />
                        )
                    }

                    </fieldset>
            )}
                <br />
                <br />
                <br />

                { action.outputs.map(({ name, type }) =>
                    <fieldset
                        className="form-group"
                        key={`${name}-text-output${counter++}`}
                    >
                        <label htmlFor={`out-${name}`}>
                        Output Name: { name }
                        </label>
                        <input
                            type="text-field"
                            className="form-control"
                            name={`out-${name}`}
                            placeholder={type}
                        />
                    </fieldset>
            )}
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={cancelJob}
                >
                    {children === null ? 'Cancel' : 'Exit'}
                </button>
                <button
                    disabled={children && children.type.displayName === 'JobRunning'}
                    className="btn btn-primary pull-right"
                    type="submit"
                >
                    {children === null ? 'Go!' : 'Run again!'}
                </button>
            </form>
            <br />
            <br />
            { children }
        </div>
    );
};

Job.propTypes = {
    inputs: React.PropTypes.object,
    action: React.PropTypes.object,
    children: React.PropTypes.element,
    metadata: React.PropTypes.array,
    submitJob: React.PropTypes.func,
    cancelJob: React.PropTypes.func
};

export default Job;
