// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { connect } from 'react-redux';

import JobHistory from '../components/JobHistory';

const mapStateToProps = ({ jobs }, { params: { uuid } }) => {
    const job = (jobs.activeJobs.find(j => j.uuid === uuid) ||
                 jobs.completedJobs.find(j => j.uuid === uuid) ||
                 jobs.failedJobs.find(j => j.uuid === uuid));
    return { job };
};


export default connect(
    mapStateToProps
)(JobHistory);
