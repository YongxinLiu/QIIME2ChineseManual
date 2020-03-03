// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { connect } from 'react-redux';

import ArtifactDetail from '../components/ArtifactDetail';
import actions from '../actions';


const mapStateToProps = (state, { params: { uuid } }) => {
    const artifact = (state.artifacts.artifacts.find(a => a.uuid === uuid) ||
                     state.artifacts.visualizations.find(v => v.uuid === uuid));
    return { artifact };
};


const mapDispatchToProps = dispatch => ({
    getVisualization: vis => dispatch(actions.getVisualization(vis)),
    exportArtifact: artifact => dispatch(actions.exportArtifact(artifact))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArtifactDetail);
