import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { FeatureLayer } from 'esri-leaflet';

import { useMapLayer } from '../../hooks';
import { PARCELS_LAYER_URL, DATA_LAYERS } from '../../constants';

const PARCELS_LAYER_STYLE = {
    color: 'var(--chakra-colors-yellow-600)',
    weight: 1,
    fill: false,
};

export default function ParcelLayer() {
    const layers = useSelector(state => state.map.layers);
    const showLayer = useMemo(() => layers.includes('PARCELS'), [layers]);

    return showLayer ? <RenderEsriLayer /> : null;
}

function RenderEsriLayer() {
    useMapLayer(
        new FeatureLayer({
            url: PARCELS_LAYER_URL,
            minZoom: DATA_LAYERS['PARCELS'].minZoom, // Only enable on high zooms for performance
            style: PARCELS_LAYER_STYLE,
            simplifyFactor: 0.8, // Simplify parcel shapes for performance
            fields: ['OBJECTID'], // Only fetch smallest field for performance
        })
    );
}
