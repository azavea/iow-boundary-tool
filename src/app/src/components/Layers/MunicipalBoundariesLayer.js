import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';

import { useLayerVisibility, useMapLayer } from '../../hooks';
import { useSelector } from 'react-redux';
import { MUNICIPAL_BOUNDARY_LABELS_MIN_ZOOM_LEVEL } from '../../constants';
import { PANES } from '../../constants';

const MUNICIPAL_BOUNDARIES_LAYER_STYLE = {
    color: '#553C9A', // var(--chakra-colors-purple-700)
    weight: 1,
    fillOpacity: '0.1',
    dashArray: '4',
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
    const { basemapType, mapZoom } = useSelector(state => state.map);

    // Separating this condition to its own memoized value prevents
    // re-creation of the layer on every zoom change
    const shouldShowLabels = useMemo(
        () => mapZoom > MUNICIPAL_BOUNDARY_LABELS_MIN_ZOOM_LEVEL,
        [mapZoom]
    );

    const layer = useMemo(
        () =>
            L.geoJSON(json, {
                style: () => MUNICIPAL_BOUNDARIES_LAYER_STYLE,
                pane: PANES.MUNICIPAL_BOUNDARIES.label,
                onEachFeature: shouldShowLabels
                    ? (feature, layer) => {
                          layer.bindTooltip(feature.properties.name20, {
                              permanent: true,
                              direction: 'center',
                              className: `muni-label${
                                  basemapType === 'satellite'
                                      ? ' muni-label-light'
                                      : ''
                              }`,
                              pane: PANES.MUNICIPAL_BOUNDARY_LABELS.label,
                          });
                      }
                    : null,
            }),
        [json, basemapType, shouldShowLabels]
    );

    useMapLayer(layer);
}
