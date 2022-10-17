import { useCallback, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { DomUtil } from 'leaflet';

import { setPolygon } from '../../store/mapSlice';
import { generateInitialPolygonPoints } from '../../utils';

export default function useAddPolygonCursor() {
    const map = useMap();
    const dispatch = useDispatch();
    const addPolygonMode = useSelector(state => state.map.addPolygonMode);

    const addPolygonFromEvent = useCallback(
        event => {
            if (event.originalEvent.target !== map._container) {
                // Ignore UI element clicks
                return;
            }

            map.flyTo(event.latlng);
            dispatch(
                setPolygon({
                    points: generateInitialPolygonPoints({
                        mapBounds: map.getBounds(),
                        center: event.latlng,
                    }),
                })
            );
        },
        [map, dispatch]
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
