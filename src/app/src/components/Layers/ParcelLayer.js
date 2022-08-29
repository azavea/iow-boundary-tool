import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { DynamicMapLayer } from 'esri-leaflet';

import { useMapLayer } from '../../hooks';
import { PARCELS_LAYER_URL, DATA_LAYERS } from '../../constants';

export default function ParcelLayer() {
    const layers = useSelector(state => state.map.layers);
    const showLayer = useMemo(() => layers.includes('PARCELS'), [layers]);

    return showLayer ? <RenderEsriLayer /> : null;
}

function RenderEsriLayer() {
    useMapLayer(
        new DynamicMapLayer({
            url: PARCELS_LAYER_URL,
            f: 'image',
            layers: [0, 1],
            minZoom: DATA_LAYERS['PARCELS'].minZoom, // Only enable on high zooms for performance
        })
    );
}
