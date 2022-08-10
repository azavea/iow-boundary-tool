import { Button, Text } from '@chakra-ui/react';

import ModalSection from './ModalSection';

export default function Introduction({ goToNextSection }) {
    return (
        <ModalSection
            heading='Welcome to Boundary Sync'
            nextButton={
                <Button variant='cta' onClick={goToNextSection}>
                    Get Started
                </Button>
            }
        >
            <Text textStyle='welcomeIntro'>
                Build a digital map of your service area boundary in minutes for
                free. No complex software or training needed.
            </Text>
            <br />
            <Button variant='link'>Learn more &gt;</Button>
        </ModalSection>
    );
}
