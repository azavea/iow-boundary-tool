import { createSlice } from '@reduxjs/toolkit';
import { DATA_LAYERS, MAP_INITIAL_ZOOM } from '../constants';

const initialState = {
    polygon: null,
    addPolygonMode: false,
    editMode: false,
    annotateMode: false,
    layers: Object.keys(DATA_LAYERS),
    basemapType: 'default',
    geocodeResult: null,
    mapZoom: MAP_INITIAL_ZOOM,
    referenceImages: {},
};

export const createDefaultReferenceImage = name => ({
    name,
    visible: true,
    corners: null,
    mode: 'distort',
    transparent: false,
    outlined: false,
});

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
        setPolygon: (state, { payload: newPolygon }) => {
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
        toggleAnnotateMode: state => {
            state.annotateMode = !state.annotateMode;
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
        setMapZoom: (state, { payload: mapZoom }) => {
            state.mapZoom = mapZoom;
        },
        toggleReferenceImageVisibility: (state, { payload: url }) => {
            state.referenceImages[url].visible =
                !state.referenceImages[url].visible;
        },
        updateReferenceImage: (state, { payload: { url, update } }) => {
            state.referenceImages[url] = {
                ...(state.referenceImages?.[url] ?? {}),
                ...update,
            };
        },
    },
});

export const {
    setPolygon,
    updatePolygon,
    deletePolygon,
    togglePolygonVisibility,
    renamePolygon,
    startAddPolygon,
    cancelAddPolygon,
    toggleEditMode,
    toggleAnnotateMode,
    toggleLayer,
    setBasemapType,
    setGeocodeResult,
    clearGeocodeResult,
    setMapZoom,
    toggleReferenceImageVisibility,
    updateReferenceImage,
} = mapSlice.actions;

export default mapSlice.reducer;
