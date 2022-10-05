import DrawTools from '../components/DrawTools';
import Layers from '../components/Layers';
import Map from '../components/Map';

export default function Draw() {
    return (
        <Map>
            <Layers />
            <DrawTools />
        </Map>
    );
}
