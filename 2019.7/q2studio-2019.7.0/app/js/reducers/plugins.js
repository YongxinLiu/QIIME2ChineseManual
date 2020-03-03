// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

const initialState = [];

const addMethod = (plugin, method) => {
    const updatedPlugin = {
        ...plugin,
        methods: [...plugin.methods, { ...method, requires: [] }]
    };
    return updatedPlugin;
};

const addVisualizer = (plugin, visualizer) => {
    const updatedPlugin = {
        ...plugin,
        visualizers: [...plugin.visualizers, { ...visualizer, requires: [] }]
    };
    return updatedPlugin;
};

const setMethodRequirements = (plugin, method, requirements) => {
    const updatedPlugin = {
        ...plugin,
        methods: [
            ...plugin.methods.filter(w => w.name !== method.name),
            {
                ...method,
                requires: requirements
            }
        ]
    };
    return updatedPlugin;
};

const setVisualizerRequirements = (plugin, visualizer, requirements) => {
    const updatedPlugin = {
        ...plugin,
        visualizers: [
            ...plugin.visualizers.filter(w => w.name !== visualizer.name),
            {
                ...visualizer,
                requires: requirements
            }
        ]
    };
    return updatedPlugin;
};

const pluginsReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'FOUND_PLUGIN': {
        const newState = [
            ...state,
            {
                name: action.plugin.name,
                methods: [],
                visualizers: []
            }
        ];
        return newState;
    }
    case 'FOUND_METHOD': {
        const originalPlugin = state.find(plugin => plugin.name === action.plugin);
        const filteredState = state.filter(plugin => plugin.name !== action.plugin);
        const newPlugin = addMethod(originalPlugin, action.method);
        const newState = [
            ...filteredState,
            newPlugin
        ];
        return newState;
    }
    case 'FOUND_VISUALIZER': {
        const originalPlugin = state.find(plugin => plugin.name === action.plugin);
        const filteredState = state.filter(plugin => plugin.name !== action.plugin);
        const newPlugin = addVisualizer(originalPlugin, action.visualizer);
        const newState = [
            ...filteredState,
            newPlugin
        ];
        return newState;
    }
    case 'MISSING_TYPES': {
        const originalPlugin = { ...state.find(p => p.name === action.pluginName) };
        const filteredState = state.filter(p => p.name !== action.pluginName);
        const pluginCloner = (action.actionType === 'methods'
                                ? setMethodRequirements : setVisualizerRequirements);
        return [
            ...filteredState,
            pluginCloner(originalPlugin, action.action, action.types)
        ];
    }
    default:
        return state;
    }
};

export default pluginsReducer;
