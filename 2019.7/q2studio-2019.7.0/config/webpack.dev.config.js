// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const extendConfig = require('./webpack.shared');


module.exports = extendConfig((config) => {
    return {
        entry: [
            'webpack-dev-server/client?http://localhost:4242',
            'webpack/hot/only-dev-server',
            path.resolve(__dirname, '../app/js/main.jsx')
        ],
        plugins: [...config.plugins,
            new HtmlWebpackPlugin({
                template: 'app/index.html',
                inject: true
            })
        ],
        module: {
            loaders: [
                ...config.module.loaders.filter(loader => loader.loader !== 'babel-loader'),
                {
                    test: /\.jsx?$/,
                    loaders: ['react-hot', 'babel-loader'],
                    exclude: path.join(__dirname, '../node_modules/')
                }
            ]
        },
        devServer: {
            contentBase: 'build',
            quiet: false,
            noInfo: false,
            stats: {
                assets: false,
                colors: true,
                chunkModules: false
            }
        },
        target: 'electron-renderer'
    };
}, true);
