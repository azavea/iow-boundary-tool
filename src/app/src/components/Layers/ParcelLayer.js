import { DynamicMapLayer } from 'esri-leaflet';

import { useLayerVisibility, useMapLayer } from '../../hooks';
import { PARCELS_LAYER_URL, DATA_LAYERS, PANES } from '../../constants';

const PARCELS_LAYER_STYLE = {
    id: 1,
    source: {
        type: 'mapLayer',
        mapLayerId: 1,
    },
    drawingInfo: {
        renderer: {
            type: 'simple',
            symbol: {
                type: 'esriSFS',
                style: 'esriSFSSolid',
                color: [0, 0, 0, 0], // No fill
                outline: {
                    type: 'esriSLS',
                    style: 'esriSLSSolid',
                    color: [183, 121, 31, 255], // var(--chakra-colors-yellow-600)
                    width: 1.0,
                },
            },
        },
    },
};

export default function ParcelLayer() {
    const showLayer = useLayerVisibility('PARCELS');

    return showLayer ? <RenderEsriLayer /> : null;
}

function RenderEsriLayer() {
    useMapLayer(
        new DynamicMapLayer({
            url: PARCELS_LAYER_URL,
            f: 'image',
            layers: [0, 1],
            minZoom: DATA_LAYERS['PARCELS'].minZoom, // Only enable on high zooms for performance
            dynamicLayers: JSON.stringify([PARCELS_LAYER_STYLE]),
            pane: PANES.PARCELS.label,
        })
    );
}
