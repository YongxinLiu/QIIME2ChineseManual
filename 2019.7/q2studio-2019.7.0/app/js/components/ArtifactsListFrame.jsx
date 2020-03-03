// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';

import Artifacts from './Artifacts';
import Tabs from './Tabs';
import Metadata from './Metadata';

const ArtifactsListFrame = ({
    artifacts,
    visualizations,
    metadata,
    changeArtifactTab,
    refreshArtifacts,
    currentIndex,
    ...props
}) => {
    const lookup = [artifacts, visualizations];
    const names = ['artifact', 'visualization', 'metadata'];
    return (<Tabs
        tabs={['Artifacts', 'Visualizations', 'Metadata']}
        getCount={idx => (idx < 2 ? lookup[idx].length : metadata.length)}
        contents={lookup.map((listing, idx) => (
            <Artifacts data={listing} type={names[idx]} {...props} />)
        ).concat(<Metadata metadata={metadata} />)}
        currentIndex={currentIndex}
        changeTab={changeArtifactTab}
        refresh={refreshArtifacts}
    />);
};

ArtifactsListFrame.propTypes = {
    artifactTab: React.PropTypes.string,
    changeArtifactTab: React.PropTypes.func,
    refreshArtifacts: React.PropTypes.func,
    artifacts: React.PropTypes.array,
    visualizations: React.PropTypes.array,
    metadata: React.PropTypes.array,
    currentIndex: React.PropTypes.number
};


export default ArtifactsListFrame;
