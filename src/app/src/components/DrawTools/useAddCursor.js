import { useCallback, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { DomUtil } from 'leaflet';
import { disableAddCursor } from '../../store/mapSlice';

export default function useAddCursor(onAdd) {
    const dispatch = useDispatch();
    const map = useMap();
    const showAddCursor = useSelector(state => state.map.showAddCursor);

    const wrappedOnAdd = useCallback(
        event => {
            if (event.originalEvent.target !== map._container) {
                // Ignore UI element clicks
                return;
            }

            onAdd(event);

            dispatch(disableAddCursor());
        },
        [dispatch, map._container, onAdd]
    );

    useEffect(() => {
        if (showAddCursor) {
            DomUtil.addClass(map._container, 'crosshair-cursor-enabled');
            map.on('click', wrappedOnAdd);

            return () => {
                DomUtil.removeClass(map._container, 'crosshair-cursor-enabled');
                map.off('click', wrappedOnAdd);
            };
        }
    }, [map, showAddCursor, wrappedOnAdd]);
}
