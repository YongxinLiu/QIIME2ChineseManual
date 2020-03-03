// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

const initialState = {
    knownTypes: {},
    importableTypes: [],
    importableFormats: [],
    yes: {},
    no: {}
};

const mergeObjects = (from, to) => {
    const result = {
        ...to
    };
    for (const key of Object.keys(from)) {
        result[key] = new Set([
            ...from[key],
            ...(to[key] || [])
        ]);
    }
    return result;
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case 'MEMOIZE_SUBTYPE': {
        const newState = {
            ...state,
            yes: mergeObjects(action.results.yes, state.yes),
            no: mergeObjects(action.results.no, state.no)
        };
        return newState;
    }
    case 'FOUND_TYPES': {
        const newState = {
            ...state,
            knownTypes: { ...state.knownTypes, ...action.typeList }
        };
        return newState;
    }
    case 'IMPORTABLE_TYPES': {
        const newState = {
            ...state,
            importableTypes: action.importableTypesList.sort().map(
                item => ({ value: item, label: item })
            )
        };
        return newState;
    }
    case 'IMPORTABLE_FORMATS': {
        const newState = {
            ...state,
            importableFormats: action.importableFormatsList.sort().map(
                item => ({ value: item, label: item })
            )
        };
        return newState;
    }
    default: return state;
    }
};

export default reducer;
