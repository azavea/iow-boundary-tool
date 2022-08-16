import { MapContainer, TileLayer } from 'react-leaflet';

import { DRAW_MAP_ID, MAP_CENTER, MAP_INITIAL_ZOOM } from '../constants';

export default function Map({ children }) {
    return (
        <MapContainer
            id={DRAW_MAP_ID}
            center={MAP_CENTER}
            zoom={MAP_INITIAL_ZOOM}
            zoomControl={false}
            style={{ height: '100vh' }}
        >
            <TileLayer
                attribution='Powered by <a href="https://www.esri.com/">ESRI</a>'
                url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png'
            />
            {children}
        </MapContainer>
    );
}
