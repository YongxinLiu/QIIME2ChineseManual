// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';
import Collapse, { Panel } from 'rc-collapse';

import Workflows from '../containers/Workflows';

import '!style-loader!css-loader!rc-collapse/assets/index.css'; // eslint-disable-line


const Plugins = ({ plugins }) => (
    <div>
        <h4>
            Available Plugins:
        </h4>
        { plugins.length ?
            (<Collapse accordion key="collapse">
                {plugins.map(plugin =>
                    <Panel header={plugin.name} key={`${plugin.name}-panel`}>
                        { plugin.methods.length ?
                            <div>
                                <h6>
                                    Methods:
                                </h6>
                                <Workflows
                                    key={`${plugin.name}-methods`}
                                    plugin={plugin.name}
                                    listing={plugin.methods}
                                    type="methods"
                                />
                            </div> : null
                        }
                        { plugin.visualizers.length ?
                            <div>
                                <h6>
                                    Visualizers:
                                </h6>
                                <Workflows
                                    key={`${plugin.name}-visualizers`}
                                    plugin={plugin.name}
                                    listing={plugin.visualizers}
                                    type="visualizers"
                                />
                            </div> : null
                        }
                    </Panel>)}
            </Collapse>)
            :
            (<h5>
                No Plugins Found
            </h5>)
        }
    </div>
);


Plugins.propTypes = {
    plugins: React.PropTypes.array
};

export default Plugins;
