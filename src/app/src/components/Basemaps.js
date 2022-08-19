import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

import {
    DEFAULT_BASEMAP_URL,
    ESRI_ATTRIBUTION,
    SATELLITE_BASEMAP_URL,
} from '../constants';

export function DefaultBasemap() {
    return <Basemap url={DEFAULT_BASEMAP_URL} attribution={ESRI_ATTRIBUTION} />;
}

export function SatelliteBasemap() {
    return (
        <Basemap url={SATELLITE_BASEMAP_URL} attribution={ESRI_ATTRIBUTION} />
    );
}

function Basemap({ url, attribution }) {
    const map = useMap();

    useEffect(() => {
        const layer = L.tileLayer(url, { attribution });
        map.addLayer(layer);

        return () => {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        };
    }, [map, url, attribution]);
}
