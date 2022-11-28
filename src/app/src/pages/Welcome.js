import Map from '../components/Map';
import WelcomeModal from '../components/WelcomeModal';
import { DefaultBasemap } from '../components/Layers/Basemaps';

export default function Welcome() {
    return (
        <Map>
            <WelcomeModal />
            <DefaultBasemap />
        </Map>
    );
}
