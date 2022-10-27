import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { useDispatch, useSelector } from 'react-redux';

import { customizePrototypeIcon } from '../../utils';
import {
    DEBOUNCE_INTERVAL,
    PANES,
    POLYGON_LAYER_OPTIONS,
} from '../../constants';
import { useUpdateBoundaryShapeMutation } from '../../api/boundaries';
import { useBoundaryId, useTrailingDebounceCallback } from '../../hooks';
import { useDrawBoundary } from '../DrawContext';
import api from '../../api/api';

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

function getShapeFromDrawEvent(event) {
    return {
        coordinates: [
            event.poly.getLatLngs()[0].map(point => [point.lng, point.lat]),
        ],
    };
}

export default function useEditingPolygon() {
    const dispatch = useDispatch();
    const map = useMap();
    const id = useBoundaryId();

    const shape = useDrawBoundary().submission?.shape;
    const { editMode, basemapType, polygonIsVisible } = useSelector(
        state => state.map
    );

    const [updateShape] = useUpdateBoundaryShapeMutation();

    const updatePolygonFromDrawEvent = useTrailingDebounceCallback({
        callback: event => {
            updateShape({ id, shape: getShapeFromDrawEvent(event) });
        },
        immediateCallback: event => {
            dispatch(
                api.util.updateQueryData(
                    'getBoundaryDetails',
                    id,
                    draftDetails => {
                        draftDetails.submission.shape =
                            getShapeFromDrawEvent(event);
                    }
                )
            );
        },
        interval: DEBOUNCE_INTERVAL,
    });

    useEffect(() => {
        if (shape && polygonIsVisible) {
            const polygonLayer = new L.Polygon(
                shape.coordinates[0].map(
                    point => new L.latLng(point[1], point[0])
                ),
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
    }, [
        shape,
        polygonIsVisible,
        editMode,
        basemapType,
        map,
        updatePolygonFromDrawEvent,
    ]);
}
