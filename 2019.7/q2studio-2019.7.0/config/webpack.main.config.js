// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

const path = require('path');
const webpack = require('webpack');
const extendConfig = require('./webpack.shared');


module.exports = extendConfig(() => {
    return {
        entry: [
            path.resolve(__dirname, '../app/main.js')
        ],
        output: {
            path: path.resolve(__dirname, '../build'),
            filename: 'main.js'
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ],
        target: 'electron-main',
        node: {
            // Needed to support ${__dirname}
            __dirname: false,
            __filename: false
        }
    };
}, false);
