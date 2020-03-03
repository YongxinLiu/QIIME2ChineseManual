// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import * as artifactActionCreators from './artifacts';
import * as jobsActionCreators from './jobs';
import * as pluginActionCreators from './plugins';
import * as connectionActionCreators from './connection';
import * as currentDirectoryActionCreators from './currentdirectory';
import * as tabActionCreators from './tabstate';
import * as typeActionCreators from './types';
import * as formatActionCreators from './formats';
import * as windowStateActionCreators from './windowstate';

const actions = {
    ...artifactActionCreators,
    ...jobsActionCreators,
    ...pluginActionCreators,
    ...connectionActionCreators,
    ...currentDirectoryActionCreators,
    ...tabActionCreators,
    ...typeActionCreators,
    ...formatActionCreators,
    ...windowStateActionCreators
};

export default actions;
