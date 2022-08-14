import L from 'leaflet';

import { useSetMaxZoomLevel, useMapLayer } from '../../hooks';
import {
    DEFAULT_BASEMAP_URL,
    LANDWATER_BASEMAP_URL,
    ESRI_ATTRIBUTION,
    SATELLITE_BASEMAP_URL,
    PANES,
} from '../../constants';

export function DefaultBasemap() {
    return (
        <Basemap
            url={DEFAULT_BASEMAP_URL}
            attribution={ESRI_ATTRIBUTION}
            maxZoomLevel={16}
        />
    );
}

export function LandWaterBasemap() {
    return (
        <Basemap
            url={LANDWATER_BASEMAP_URL}
            attribution={ESRI_ATTRIBUTION}
            maxZoomLevel={16}
        />
    );
}

export function SatelliteBasemap() {
    return (
        <Basemap
            url={SATELLITE_BASEMAP_URL}
            attribution={ESRI_ATTRIBUTION}
            maxZoomLevel={18}
        />
    );
}

function Basemap({ url, attribution, maxZoomLevel }) {
    useSetMaxZoomLevel(maxZoomLevel);
    useMapLayer(L.tileLayer(url, { attribution, pane: PANES.BASEMAP.label }));

    return null;
}
