// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { connect } from 'react-redux';

import Directory from '../components/Directory';
import actions from '../actions';

const mapStateToProps = state => ({
    path: state.currentDirectory
});

const mapDispatchToProps = dispatch => ({
    dispatchChangeDirectory: path => dispatch(actions.directoryChangeDialog(path))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Directory);
