import { createSlice } from '@reduxjs/toolkit';
import { DATA_LAYERS, MAP_INITIAL_ZOOM } from '../constants';

const initialState = {
    polygonIsVisible: true,
    showAddCursor: false,
    editMode: true,
    layers: Object.keys(DATA_LAYERS),
    basemapType: 'default',
    geocodeResult: null,
    mapZoom: MAP_INITIAL_ZOOM,
    hasZoomedToShape: false,
};

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        togglePolygonVisibility: state => {
            state.polygonIsVisible = !state.polygonIsVisible;
        },
        enableAddCursor: state => {
            state.showAddCursor = true;
        },
        disableAddCursor: state => {
            state.showAddCursor = false;
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
        setMapZoom: (state, { payload: mapZoom }) => {
            state.mapZoom = mapZoom;
        },
        setHasZoomedToShape: (state, { payload: hasZoomedToShape }) => {
            state.hasZoomedToShape = hasZoomedToShape;
        },
    },
});

export const {
    togglePolygonVisibility,
    enableAddCursor,
    disableAddCursor,
    toggleEditMode,
    toggleLayer,
    setBasemapType,
    setGeocodeResult,
    clearGeocodeResult,
    setMapZoom,
    setHasZoomedToShape,
} = mapSlice.actions;

export default mapSlice.reducer;
