import { MapContainer } from 'react-leaflet';
import { useLocation } from 'react-router-dom';

import { MAP_CENTER, MAP_INITIAL_ZOOM, NAVBAR_HEIGHT } from '../constants';
import MapPanes from './MapPanes';

export default function Map({ children }) {
    const location = useLocation();

    // Anywhere but welcome activity, deduct height of nav bar
    const heightExpression = location.pathname.startsWith('/welcome')
        ? '100vh'
        : `calc(100vh - ${NAVBAR_HEIGHT}px)`;

    return (
        <MapContainer
            center={MAP_CENTER}
            zoom={MAP_INITIAL_ZOOM}
            zoomControl={false}
            style={{ height: heightExpression }}
        >
            <MapPanes>{children}</MapPanes>
        </MapContainer>
    );
}
