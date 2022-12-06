import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { generateInitialPolygonPoints } from '../../utils';
import { useUpdateBoundaryShapeMutation } from '../../api/boundaries';
import { useBoundaryId, useEndpointToastError } from '../../hooks';
import api from '../../api/api';
import { useMap } from 'react-leaflet';
import useAddCursor from './useAddCursor';

export default function AddPolygon() {
    const dispatch = useDispatch();
    const map = useMap();
    const id = useBoundaryId();

    const [updateShape, { error }] = useUpdateBoundaryShapeMutation();
    useEndpointToastError(error);

    const addPolygonFromEvent = useCallback(
        event => {
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

            updateShape({ id, shape: polygon });
        },
        [map, dispatch, id, updateShape]
    );

    useAddCursor(addPolygonFromEvent);
}
