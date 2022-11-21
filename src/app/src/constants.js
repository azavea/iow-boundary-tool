export const MAP_CENTER = [35.7938, -78.7232]; // Raleigh, North Carolina
export const MAP_INITIAL_ZOOM = 13;
export const INITIAL_POLYGON_SCALE_FACTOR = 0.5;

export const POLYGON_LAYER_OPTIONS = {
    weight: 1,
    fillColor: 'black',
    fillOpacity: '.3',
    dashArray: '2 3',
    color: 'black',
};

export const DATA_LAYERS = {
    PARCELS: { label: 'Parcel data', minZoom: 14 },
    MUNICIPAL_BOUNDARIES: { label: 'Municipal boundaries' },
};

export const ESRI_ATTRIBUTION =
    'Powered by <a href="https://www.esri.com/">ESRI</a>';
export const DEFAULT_BASEMAP_URL =
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png';
export const LANDWATER_BASEMAP_URL =
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png';
export const SATELLITE_BASEMAP_URL =
    'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png';

// Bounding box data from https://observablehq.com/@rdmurphy/u-s-state-bounding-boxes
export const NC_WEST = -84.321782;
export const NC_EAST = -75.459815;
export const NC_NORTH = 36.588133;
export const NC_SOUTH = 33.851169;

export const PARCELS_LAYER_URL =
    'https://services.nconemap.gov/secure/rest/services/NC1Map_Parcels/MapServer';

export const SIDEBAR_TEXT_TOOLTIP_THRESHOLD = 30;

export const MUNICIPAL_BOUNDARY_LABELS_MIN_ZOOM_LEVEL = 9;

export const NAVBAR_HEIGHT = 68;
export const UTILITY_CONTROL_WIDTH = 320;

// https://leafletjs.com/reference.html#map-mappane
export const PANES = {
    BASEMAP: { label: 'basemap', zIndex: 200 },
    PARCELS: { label: 'parcels', zIndex: 210 },
    MUNICIPAL_BOUNDARIES: { label: 'muni', zIndex: 220 },
    MUNICIPAL_BOUNDARY_LABELS: { label: 'muni-labels', zIndex: 225 },
    USER_POLYGON: { label: 'user-polygon', zIndex: 490 },
    ANNOTATION_MARKERS: { label: 'annotation-markers', zIndex: 495 },
    ANNOTATION_POPUPS: { label: 'annotation-popups', zIndex: 496 },
};

export const BASE_API_URL = 'api';
export const API_URLS = {
    LOGIN: `${BASE_API_URL}/auth/login/`,
    LOGOUT: `${BASE_API_URL}/auth/logout/`,
    FORGOT: `${BASE_API_URL}/auth/password/reset/`,
    CONFIRM: `${BASE_API_URL}/auth/password/reset/confirm/`,
};

export const API_STATUSES = {
    REDIRECT: 302,
};

export const APP_URLS = {
    RESET: 'confirm_password_reset/reset/',
};

export const DEBOUNCE_INTERVAL = 3000;

// In sync with django.api.models.boundary.BOUNDARY_STATUS
export const BOUNDARY_STATUS = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    IN_REVIEW: 'In Review',
    NEEDS_REVISIONS: 'Needs Revisions',
    APPROVED: 'Approved',
};

// In sync with django.api.models.user.Roles
export const ROLES = {
    CONTRIBUTOR: 'C',
    VALIDATOR: 'V',
    ADMINISTRATOR: 'A',
};

export const REFERENCE_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg'];
export const REFERENCE_IMAGE_FILE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
export const SHAPE_FILE_EXTENSIONS = ['.zip', '.geojson'];

export const ACCEPT_IMAGES = [
    ...REFERENCE_IMAGE_MIME_TYPES,
    ...REFERENCE_IMAGE_FILE_EXTENSIONS,
].join(', ');

export const ACCEPT_SHAPES = SHAPE_FILE_EXTENSIONS.join(', ');

export const ACCEPT_BOTH = `${ACCEPT_IMAGES}, ${ACCEPT_SHAPES}`;

export const SUBMIT_REVIEW_BUTTON_TEXT = 'Request changes';
