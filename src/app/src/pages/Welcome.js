import Map from '../components/Map';
import WelcomeModal from '../components/WelcomeModal';
import { DefaultBasemap } from '../components/Basemaps';

export default function Welcome() {
    return (
        <>
            <WelcomeModal />
            <Map>
                <DefaultBasemap />
            </Map>
        </>
    );
}
