import { useState } from 'react';

import {
    Box,
    Button,
    Collapse,
    Heading,
    Text,
    List,
    ListIcon,
    ListItem,
} from '@chakra-ui/react';
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@heroicons/react/solid';

import ModalSection from './ModalSection';
import { heroToChakraIcon } from '../../utils';

export default function Introduction({ goToNextSection }) {
    const [showLearnMore, setShowLearnMore] = useState(false);

    const LearnMoreArrow = heroToChakraIcon(
        showLearnMore ? ChevronDownIcon : ChevronRightIcon
    );

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
            <Button
                variant='link'
                rightIcon={<LearnMoreArrow />}
                onClick={() =>
                    setShowLearnMore(showLearnMore => !showLearnMore)
                }
            >
                Learn more
            </Button>
            <Collapse in={showLearnMore}>
                <LearnMoreSection />
            </Collapse>
        </ModalSection>
    );
}

function LearnMoreSection() {
    return (
        <Box pt={4}>
            <Heading size='sm' pb={2}>
                Having a digital boundary map can make it easier to:
            </Heading>
            <List>
                <LearnMoreListItem>
                    Submit your Local Water Supply Plan annually
                </LearnMoreListItem>
                <LearnMoreListItem>
                    See and avoid boundary conflicts
                </LearnMoreListItem>
                <LearnMoreListItem>
                    Make adjustments as your system expands
                </LearnMoreListItem>
                <LearnMoreListItem>Share with coworkers</LearnMoreListItem>
                <LearnMoreListItem>Access funding </LearnMoreListItem>
            </List>
        </Box>
    );
}

function LearnMoreListItem({ children }) {
    return (
        <ListItem>
            <ListIcon as={heroToChakraIcon(CheckIcon)} />
            {children}
        </ListItem>
    );
}
