// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { connect } from 'react-redux';
import { remote } from 'electron';

import Visualization from '../components/Visualization';

const mapStateToProps = ({ windowState }, { params: { uuid } }) => {
    const dummy = {};
    dummy[uuid] = undefined;
    const vis = (windowState[`window ${remote.getCurrentWindow().id}`] || dummy);
    return ({
        vis: vis[uuid]
    });
};

export default connect(
    mapStateToProps
)(Visualization);
