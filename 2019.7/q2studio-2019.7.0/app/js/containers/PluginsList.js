// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { connect } from 'react-redux';

import Plugins from '../components/Plugins';

const mapStateToProps = (state) => {
    return {
        plugins: [...state.plugins.filter(
                    plugin => plugin.methods.length || plugin.visualizers.length)]
                                       .sort((a, b) => {
                                           if (a.name > b.name) return 1;
                                           if (a.name < b.name) return -1;
                                           return 0;
                                       })
    };
};

export default connect(
    mapStateToProps
)(Plugins);
