// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import { spawn } from 'child_process';
import { app, BrowserWindow, ipcMain as ipc } from 'electron';
import path from 'path';
import { createStore, applyMiddleware, compose } from 'redux';
import { electronEnhancer } from 'redux-electron-store';
import thunk from 'redux-thunk';
import which from 'which';

import reducer from './js/reducers';

const enhancer = compose(
    applyMiddleware(
        thunk
    ),
    electronEnhancer()
);

const store = createStore(reducer, enhancer); // eslint-disable-line

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const startRestAPI = (callback) => {
    // find the conda python and use that to infer the conda bin directory
    // which needs to be reapplied to the front of our path so that subprocess
    // spawns work correctly.
    const python = which.sync('python', { all: true })
                        .find(binaryPath => binaryPath.search('conda') !== -1);
    const condaBin = path.dirname(python);

    const api = spawn('python', ['-u', '-m', 'q2studio'], {
        env: {
            ...process.env,
            // prepend conda bin to PATH
            PATH: `${condaBin}:${process.env.PATH}`
        }
    });

    let started = false;
    api.stdout.on('data', (data) => {
        if (!started) {
            started = true;
            callback(...data.toString('utf8').split(' '));
        } else {
            process.stdout.write(`API: ${data}`);
        }
    });

    api.stderr.on('data', (data) => {
        process.stderr.write(`API (error): ${data}`);
    });

    api.on('close', (code) => {
        process.stdout.write(`API process exited with code ${code}`);
    });
};

const makeURL = (port, secretKey) => {
    const secret = encodeURIComponent(secretKey);
    const frag =
        `#type=ESTABLISH_CONNECTION&uri=localhost%3A${port}&secret_key=${secret}`;
    if (process.env.NODE_ENV === 'development') {
        return `http://localhost:4242/${frag}`;
    }
    return `file://${__dirname}/index.html${frag}`;
};

const createWindow = () => {
    // Create the browser window.
    win = new BrowserWindow({ width: 1024, height: 800, x: 5, y: 5 });

    startRestAPI((port, secret) => win.loadURL(makeURL(port, secret)));

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipc.on('open-new-page', (event, data) => {
    const newWindow = new BrowserWindow({
        ...(data.settings || {}),
        parent: win
    });
    const id = `window ${newWindow.id}`;
    newWindow.on('close', () => {
        win.webContents.send('child-window-closed', { id });
    });

    const url = process.env.NODE_ENV === 'development' ?
        `http://localhost:4242/#${data.url}` :
        `file://${__dirname}/index.html#${data.url}`;

    newWindow.loadURL(url);
});

// Have to figure out how to get this to work correctly. Webpack puts this main in /build,
// so this relative path doesn't actually work and crashes Electron beyond repair when
// a reducer is attempted to be hotswapped (requires kill signals sent to shutdown)
ipc.on('renderer-reload', (event) => {
    delete require.cache[require.resolve('../app/js/reducers')];
    store.replaceReducer(require('../app/js/reducers').default); // eslint-disable-line global-require
    event.returnValue = true; // eslint-disable-line no-param-reassign
});
