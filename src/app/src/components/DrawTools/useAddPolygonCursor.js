import { useCallback, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { DomUtil } from 'leaflet';

import { generateInitialPolygonPoints } from '../../utils';
import { useUpdateBoundaryShapeMutation } from '../../api/boundaries';
import { useBoundaryId, useEndpointToastError } from '../../hooks';
import api from '../../api/api';
import { stopAddPolygon } from '../../store/mapSlice';

export default function useAddPolygonCursor() {
    const map = useMap();
    const dispatch = useDispatch();
    const id = useBoundaryId();

    const addPolygonMode = useSelector(state => state.map.addPolygonMode);
    const [updateShape, { error }] = useUpdateBoundaryShapeMutation();
    useEndpointToastError(error);

    const addPolygonFromEvent = useCallback(
        event => {
            if (event.originalEvent.target !== map._container) {
                // Ignore UI element clicks
                return;
            }

            const polygon = {
                type: 'Polygon',
                coordinates: [
                    generateInitialPolygonPoints({
                        mapBounds: map.getBounds(),
                        center: event.latlng,
                    }),
                ],
            };

            map.flyTo(event.latlng);

            dispatch(
                api.util.updateQueryData(
                    'getBoundaryDetails',
                    id,
                    draftDetails => {
                        draftDetails.submission.shape = polygon;
                    }
                )
            );
            dispatch(stopAddPolygon());
            updateShape({ id, shape: polygon });
        },
        [map, dispatch, id, updateShape]
    );

    useEffect(() => {
        if (addPolygonMode) {
            DomUtil.addClass(map._container, 'crosshair-cursor-enabled');
            map.on('click', addPolygonFromEvent);

            return () => {
                DomUtil.removeClass(map._container, 'crosshair-cursor-enabled');
                map.off('click', addPolygonFromEvent);
            };
        }
    }, [map, addPolygonMode, addPolygonFromEvent]);
}
