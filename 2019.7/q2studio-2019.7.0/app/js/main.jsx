// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, Route, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { electronEnhancer } from 'redux-electron-store';
import { ipcRenderer as ipc } from 'electron';

import App from './components/pages/App';
import Job from './containers/Job';
import reducer from './reducers';
import Auth from './containers/Auth';
import DevTools from './util/devtools';
import JobHistory from './containers/JobHistory';
import ArtifactDetail from './containers/ArtifactDetail';
import Visualization from './containers/Visualization';
import JobRunning from './components/JobRunning';

import actions from './actions';

import '!style-loader!css-loader!bootstrap-css-only'; // eslint-disable-line


const enhancerSettings = {
    filter: {
        plugins: true,
        artifacts: true,
        connection: true,
        jobs: true,
        currentDirectory: true,
        tabState: true,
        currentJob: true,
        superTypes: true,
        windowState: true
    }
};

const enhancer = process.env.NODE_ENV === 'production' ?
    compose(applyMiddleware(thunk), electronEnhancer(enhancerSettings)) :
    compose(applyMiddleware(thunk), electronEnhancer(enhancerSettings), DevTools.instrument());

const store = createStore(reducer, enhancer);

ipc.on('child-window-closed', (event, data) => {
    store.dispatch(actions.clearWindowState(data.id));
});

if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
        module.hot.accept('./reducers', () => {
            ipc.sendSync('renderer-reload');
            store.replaceReducer(require('./reducers')); // eslint-disable-line global-require
        });
    }
}

render(
    <div>
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/" component={App} />
                <Route path="job/:pluginId/:actionType/:jobId" component={Job}>
                    <Route path="running/:uuid" component={JobRunning} />
                    <Route path=":uuid" component={Visualization} />
                </Route>
                <Route path="type=:type&uri=:uri&secret_key=:secret_key" component={Auth} />
                <Route path="job/:uuid" component={JobHistory} />
                <Route path="artifact/:uuid" component={ArtifactDetail} />
            </Router>
        </Provider>
        {process.env.NODE_ENV === 'development' ? <DevTools store={store} /> : null }
    </div>,
    document.getElementById('root')
);
