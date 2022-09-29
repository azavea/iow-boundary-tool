import { useCallback, useEffect } from 'react';
import { useMap } from 'react-leaflet';

import L from 'leaflet';
import 'leaflet-draw';
import { useDispatch, useSelector } from 'react-redux';
import { updatePolygon } from '../../store/mapSlice';
import { customizePrototypeIcon } from '../../utils';
import { PANES } from '../../constants';

const POLYGON_LAYER_OPTIONS = {
    weight: 1,
    fillColor: 'black',
    fillOpacity: '.3',
    dashArray: '2 3',
};

customizePrototypeIcon(L.Draw.Polyline.prototype, 'edit-poly-marker');
customizePrototypeIcon(L.Edit.PolyVerticesEdit.prototype, 'edit-poly-marker');

const markerElements = document.getElementsByClassName('edit-poly-marker');

function styleMarkers() {
    for (const element of markerElements) {
        if (elementIsMidpointMarker(element)) {
            styleMidpointElement(element);
        }
    }
}

function elementIsMidpointMarker(element) {
    return element.style.opacity !== '';
}

function styleMidpointElement(element) {
    element.className += ' edit-poly-marker-midpoint';
}

export default function useEditingPolygon() {
    const dispatch = useDispatch();
    const map = useMap();
    const { polygon, editMode, basemapType } = useSelector(state => state.map);

    const updatePolygonFromDrawEvent = useCallback(
        event => {
            dispatch(
                updatePolygon({
                    points: event.poly
                        .getLatLngs()[0]
                        .map(point => [point.lat, point.lng]),
                })
            );
        },
        [dispatch]
    );

    useEffect(() => {
        if (polygon && polygon.visible) {
            const polygonLayer = new L.Polygon(
                polygon.points.map(point => new L.latLng(point[0], point[1])),
                {
                    ...POLYGON_LAYER_OPTIONS,
                    color: basemapType === 'satellite' ? 'white' : 'black',
                }
            );

            if (editMode) {
                polygonLayer.editing.enable();
            }

            const featureGroup = L.featureGroup([polygonLayer], {
                pane: PANES.USER_POLYGON.label,
            });

            featureGroup.addTo(map);
            styleMarkers();

            map.on(L.Draw.Event.EDITVERTEX, updatePolygonFromDrawEvent);

            return () => {
                map.off(L.Draw.Event.EDITVERTEX, updatePolygonFromDrawEvent);

                if (map.hasLayer(polygonLayer)) {
                    map.removeLayer(polygonLayer);
                }
            };
        }
    }, [polygon, editMode, basemapType, map, updatePolygonFromDrawEvent]);
}