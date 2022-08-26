import { createSlice } from '@reduxjs/toolkit';
import { DATA_LAYERS } from '../constants';

const initialState = {
    polygon: null,
    addPolygonMode: false,
    editMode: false,
    layers: Object.keys(DATA_LAYERS),
    basemapType: 'default',
    geocodeResult: null,
};

const DEFAULT_POLYGON = {
    points: [],
    visible: true,
    label: 'New Polygon',
};

function checkPolygonIsSet(state) {
    if (!state.polygon) {
        throw Error('No polygon saved');
    }
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        addPolygon: (state, { payload: newPolygon }) => {
            state.polygon = {
                ...DEFAULT_POLYGON,
                ...newPolygon,
            };
            state.addPolygonMode = false;
            state.editMode = true;
        },
        updatePolygon: (state, { payload: polygonUpdate }) => {
            checkPolygonIsSet(state);

            state.polygon = {
                ...state.polygon,
                ...polygonUpdate,
            };
        },
        deletePolygon: state => {
            state.polygon = null;
        },
        togglePolygonVisibility: state => {
            checkPolygonIsSet(state);

            state.polygon.visible = !state.polygon.visible;
        },
        renamePolygon: (state, { payload: newLabel }) => {
            checkPolygonIsSet(state);

            state.polygon.label = newLabel;
        },
        startAddPolygon: state => {
            state.addPolygonMode = true;
        },
        cancelAddPolygon: state => {
            state.addPolygonMode = false;
        },
        toggleEditMode: state => {
            state.editMode = !state.editMode;
        },
        toggleLayer: (state, { payload: layerToToggle }) => {
            if (state.layers.includes(layerToToggle)) {
                state.layers = state.layers.filter(
                    layer => layer !== layerToToggle
                );
            } else {
                state.layers.push(layerToToggle);
            }
        },
        setBasemapType: (state, { payload: basemapType }) => {
            state.basemapType = basemapType;
        },
        setGeocodeResult: (state, { payload: result }) => {
            state.geocodeResult = result;
        },
        clearGeocodeResult: state => {
            state.geocodeResult = null;
        },
    },
});

export const {
    addPolygon,
    updatePolygon,
    deletePolygon,
    togglePolygonVisibility,
    renamePolygon,
    startAddPolygon,
    cancelAddPolygon,
    toggleEditMode,
    toggleLayer,
    setBasemapType,
    setGeocodeResult,
    clearGeocodeResult,
} = mapSlice.actions;

export default mapSlice.reducer;
