import { Heading, Text } from '@chakra-ui/react';

import ModalSection from './ModalSection';

export default function HowItWorks({ PreviousButton, ContinueButton }) {
    return (
        <ModalSection
            heading="Here's how it works"
            prevButton={PreviousButton}
            nextButton={ContinueButton}
        >
            <HowItWorksListItem
                heading='1. Upload any files you’d like to use as a reference (Optional)'
                body='Some folks like to start with their current map, others dive right in and design from scratch. You can upload a simple paper sketch or a shapefile for reference, or both!'
            />
            <HowItWorksListItem
                heading='2. Adjust your map'
                body='Using our tool you can adjust points on your map to show the edge of your service area today.'
            />
            <HowItWorksListItem
                heading='3. Submit for review'
                body='After a quick check the map will be added to the NC database or sent back to you with comments.'
            />
            <HowItWorksListItem
                heading='4. Download your file'
                body='Your submitted map will be saved to your account. You can download it anytime.'
            />
        </ModalSection>
    );
}

function HowItWorksListItem({ heading, body }) {
    return (
        <>
            <Heading size='md' pb={1} pt={4}>
                {heading}
            </Heading>
            <Text fontSize='lg'>{body}</Text>
        </>
    );
}
