export const MAP_CENTER = [35.7596, -79.0193]; // North Carolina
export const MAP_INITIAL_ZOOM = 13;
export const INITIAL_POLYGON_SCALE_FACTOR = 0.5;

export const DATA_LAYERS = {
    STREETS: { label: 'Streets' },
    PARCELS: { label: 'Parcel data', minZoom: 14 },
    MUNICIPAL_BOUNDARIES: { label: 'Municipal boundaries' },
    LAND_AND_WATER: { label: 'Land & water' },
    POINTS_OF_INTEREST: { label: 'Points of interest' },
};

export const ESRI_ATTRIBUTION =
    'Powered by <a href="https://www.esri.com/">ESRI</a>';
export const DEFAULT_BASEMAP_URL =
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png';
export const SATELLITE_BASEMAP_URL =
    'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png';

// Bounding box data from https://observablehq.com/@rdmurphy/u-s-state-bounding-boxes
export const NC_WEST = -84.321782;
export const NC_EAST = -75.459815;
export const NC_NORTH = 36.588133;
export const NC_SOUTH = 33.851169;

export const PARCELS_LAYER_URL =
    'https://services.nconemap.gov/secure/rest/services/NC1Map_Parcels/MapServer';
