// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { fetchAPI } from '../util/auth';
import actions from './';

const foundPlugin = plugin => ({
    type: 'FOUND_PLUGIN',
    plugin
});

const foundMethod = (plugin, method) => ({
    type: 'FOUND_METHOD',
    plugin,
    method
});

const foundVisualizer = (plugin, visualizer) => ({
    type: 'FOUND_VISUALIZER',
    plugin,
    visualizer
});

export const loadVisualizers = (name, endpoint) => {
    return (dispatch, getState) => {
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}${endpoint}`;
        fetchAPI(secretKey, 'GET', url)
            .then(({ visualizers }) => Object.keys(visualizers).forEach(
                (key) => {
                    dispatch(foundVisualizer(name, visualizers[key]));
                    dispatch(actions.foundTypes(
                        visualizers[key].inputs.reduce((obj, input) => {
                            obj[input.type] = input.ast;  // eslint-disable-line no-param-reassign
                            return obj;
                        }, {})));
                }));
    };
};

export const loadMethods = (name, endpoint) => {
    return (dispatch, getState) => {
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}${endpoint}`;
        fetchAPI(secretKey, 'GET', url)
            .then(({ methods }) => Object.keys(methods).forEach(
                (key) => {
                    dispatch(foundMethod(name, methods[key]));
                    dispatch(actions.foundTypes(
                        methods[key].inputs.reduce((obj, input) => {
                            obj[input.type] = input.ast;  // eslint-disable-line no-param-reassign
                            return obj;
                        }, {})));
                }));
    };
};

export const loadPlugins = () => {
    return (dispatch, getState) => {
        const { connection: { uri, secretKey } } = getState();
        const url = `http://${uri}/api/plugins/`;
        const method = 'GET';
        fetchAPI(secretKey, method, url)
        .then(json => json.plugins.map(plugin => dispatch(foundPlugin(plugin))))
        .then(pluginActions => pluginActions.forEach(
                ({ plugin: { name, methodsURI, visualizersURI } }) => {
                    dispatch(loadMethods(name, methodsURI));
                    dispatch(loadVisualizers(name, visualizersURI));
                }))
        .then(() => actions.checkTypes());
    };
};
