import { useEffect, useState } from 'react';
import L from 'leaflet';

import { useLayerVisibility, useMapLayer } from '../../hooks';

const MUNICIPAL_BOUNDARIES_LAYER_STYLE = {
    color: 'purple',
    weight: 1,
    fill: false,
    dashArray: '4 8',
};

export default function MunicipalBoundariesLayer() {
    const showLayer = useLayerVisibility('MUNICIPAL_BOUNDARIES');

    const [layerData, setLayerData] = useState({
        type: 'FeatureCollection',
        features: [],
    });

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/data/muni.geo.json`)
            .then(response => response.json())
            .then(setLayerData);
    }, []);

    return showLayer && layerData ? <RenderGeoJson json={layerData} /> : null;
}

function RenderGeoJson({ json }) {
    useMapLayer(
        L.geoJSON(json, { style: () => MUNICIPAL_BOUNDARIES_LAYER_STYLE })
    );
}
