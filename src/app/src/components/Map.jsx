import { MapContainer } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { MAP_CENTER, MAP_INITIAL_ZOOM, NAVBAR_HEIGHT } from '../constants';
import MapPanes from './MapPanes';

export default function Map({ children }) {
    const location = useLocation();
    const utility = useSelector(state => state.auth.utility);

    const coordinates = utility?.location?.coordinates;
    const center = coordinates ? [coordinates[1], coordinates[0]] : MAP_CENTER;

    // Anywhere but welcome activity, deduct height of nav bar
    const heightExpression = location.pathname.startsWith('/welcome')
        ? '100vh'
        : `calc(100vh - ${NAVBAR_HEIGHT}px)`;

    return (
        <MapContainer
            center={center}
            zoom={MAP_INITIAL_ZOOM}
            zoomControl={false}
            style={{ height: heightExpression }}
        >
            <MapPanes>{children}</MapPanes>
        </MapContainer>
    );
}
