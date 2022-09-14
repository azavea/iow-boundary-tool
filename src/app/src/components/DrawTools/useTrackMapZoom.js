import { useMapEvent } from 'react-leaflet';
import { useDispatch } from 'react-redux';

import { setMapZoom } from '../../store/mapSlice';

export default function useTrackMapZoom() {
    const dispatch = useDispatch();

    const mapEvents = useMapEvent('zoomend', () => {
        dispatch(setMapZoom(mapEvents.getZoom()));
    });
}
