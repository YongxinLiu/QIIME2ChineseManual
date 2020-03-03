// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = function extendConfig(override, isDev) {
    var cssLoader = 'css-loader?modules&importLoaders=1' + // eslint-disable-line no-var
                    '&localIdentName=[name]--[local]-[hash:base64:5]!postcss-loader';
    if (!isDev) {
        cssLoader = ExtractTextPlugin.extract('style-loader', cssLoader);
    } else {
        cssLoader = `style-loader!${cssLoader}`;
    }

    const defaultConfig = {
        entry: [
            path.resolve(__dirname, '../app/js/main.jsx')
        ],
        output: {
            path: path.resolve(__dirname, '../build'),
            filename: 'js/bundle.js'
        },
        plugins: [],
        resolve: {
            extensions: ['', '.js', '.jsx']
        },
        module: {
            loaders: [
                {
                    test: /\.png$/,
                    // inline files < 5kb
                    loader: 'url-loader?limit=5000&name=img/[name]-[hash].[ext]'
                },
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: path.join(__dirname, '../node_modules/')
                },
                {
                    test: /\.css$/,
                    loader: cssLoader
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                    loader: 'url-loader'
                }
            ]
        },
        postcss: [autoprefixer]
    };

    return Object.assign({}, defaultConfig, override(defaultConfig));
};
