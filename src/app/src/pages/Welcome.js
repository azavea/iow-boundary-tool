import WelcomeModal from '../components/WelcomeModal';
import { DefaultBasemap } from '../components/Layers/Basemaps';

export default function Welcome() {
    return (
        <>
            <WelcomeModal />
            <DefaultBasemap />
        </>
    );
}
