// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { connect } from 'react-redux';

import actions from '../actions';
import JobListFrame from '../components/JobListFrame';

const mapStateToProps = ({
    jobs: { activeJobs, completedJobs, failedJobs },
    tabState: { jobs: { currentIndex } } }) => ({
        activeJobs,
        completedJobs,
        failedJobs,
        currentIndex
    });

const mapDispatchToProps = dispatch => ({
    changeJobTab: idx => dispatch(actions.changeTab('jobs', idx))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(JobListFrame);
