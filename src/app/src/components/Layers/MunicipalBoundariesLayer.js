import L from 'leaflet';
import 'leaflet.vectorgrid';

import { useToken } from '@chakra-ui/react';

import { useLayerVisibility, useMapLayer } from '../../hooks';
import { MUNICIPAL_BOUNDARIES, PANES } from '../../constants';

export default function MunicipalBoundariesLayer() {
    const showLayer = useLayerVisibility('MUNICIPAL_BOUNDARIES');

    return showLayer ? <VectorGrid {...MUNICIPAL_BOUNDARIES} /> : null;
}

function VectorGrid({ url, maxNativeZoom = 12 }) {
    const [purple700] = useToken('colors', ['purple.700']);

    const layer = L.vectorGrid.protobuf(url, {
        pane: PANES.MUNICIPAL_BOUNDARIES.label,
        maxNativeZoom,
        vectorTileLayerStyles: {
            places_simple: (_properties, zoom) => ({
                // Fill
                fill: true,
                fillColor: purple700,
                fillOpacity: '0.1',
                // Stroke, should vary with Zoom
                // Linear equation where f(12) = 0.5, f(14) = 0.4, etc
                weight: zoom * -0.1 + 1.7,
                color: purple700,
                dashArray: '4',
            }),
        },
    });

    useMapLayer(layer);
}
