// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { connect } from 'react-redux';

import ArtifactsListFrame from '../components/ArtifactsListFrame';
import actions from '../actions';

const mapStateToProps = ({
    artifacts: { artifacts, visualizations, metadata },
    tabState: { artifacts: { currentIndex } }
}) => ({
    artifacts,
    visualizations,
    metadata,
    currentIndex
});

const mapDispatchToProps = dispatch => ({
    dispatchDeleteArtifact: id => dispatch(actions.deleteArtifact(id)),
    dispatchDeleteVisualization: id => dispatch(actions.deleteVisualization(id)),
    dispatchDeleteMetadata: fp => dispatch(actions.deleteMetadata(fp)),
    refreshArtifacts: () => {
        dispatch(actions.refreshArtifacts());
        dispatch(actions.refreshVisualizations());
        dispatch(actions.refreshMetadata());
    },
    changeArtifactTab: idx => dispatch(actions.changeTab('artifacts', idx))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArtifactsListFrame);
