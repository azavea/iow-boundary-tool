import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { FeatureLayer } from 'esri-leaflet';

import { useMapLayer } from '../../hooks';
import { PARCELS_LAYER_URL } from '../../constants';

export default function ParcelLayer() {
    const layers = useSelector(state => state.map.layers);
    const showLayer = useMemo(() => layers.includes('PARCELS'), [layers]);

    return showLayer ? <RenderEsriLayer /> : null;
}

function RenderEsriLayer() {
    useMapLayer(
        new FeatureLayer({
            url: PARCELS_LAYER_URL,
            minZoom: 14,
        })
    );
}
