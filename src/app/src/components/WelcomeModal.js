import { useState } from 'react';
import { Button, Modal, ModalOverlay } from '@chakra-ui/react';

import HowItWorks from './ModalSections/HowItWorks';
import Introduction from './ModalSections/Introduction';
import FileUpload from './ModalSections/FileUpload';

const sections = [Introduction, HowItWorks, FileUpload];
const firstSection = 0;
const lastSection = sections.length - 1;

export default function WelcomeModal() {
    const [currentSection, setCurrentSection] = useState(0);

    const goToNextSection = () => {
        setCurrentSection(previousSection =>
            Math.min(previousSection + 1, lastSection)
        );
    };

    const goToPreviousSection = () => {
        setCurrentSection(previousSection =>
            Math.max(previousSection - 1, firstSection)
        );
    };

    const PreviousButton = (
        <Button variant='secondary' onClick={goToPreviousSection}>
            Previous
        </Button>
    );

    const ContinueButton = (
        <Button variant='cta' onClick={goToNextSection}>
            Continue
        </Button>
    );

    const Section = sections[currentSection];

    return (
        <Modal isOpen isCentered size={'5xl'}>
            <ModalOverlay />
            <Section
                {...{
                    goToNextSection,
                    goToPreviousSection,
                    PreviousButton,
                    ContinueButton,
                }}
            />
        </Modal>
    );
}
