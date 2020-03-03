// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { connect } from 'react-redux';

import Loading from '../components/Loading';

const mapStateToProps = state => ({
    status: state.connection.message
});

export default connect(
    mapStateToProps
)(Loading);
