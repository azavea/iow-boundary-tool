import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import L from 'leaflet';

import { useMapLayer } from '../../hooks';

const MUNICIPAL_BOUNDARIES_LAYER_STYLE = {
    color: 'purple',
    weight: 1,
    fill: false,
    dashArray: '4 8',
};

export default function MunicipalBoundariesLayer() {
    const layers = useSelector(state => state.map.layers);
    const showLayer = useMemo(
        () => layers.includes('MUNICIPAL_BOUNDARIES'),
        [layers]
    );

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
