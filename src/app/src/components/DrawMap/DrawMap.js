import { Button, Icon } from '@chakra-ui/react';

import { ArrowRightIcon } from '@heroicons/react/outline';

import Map from '../Map';
import EditToolbar from './EditToolbar';
import MapControlButtons from './MapControlButtons';
import MapFeatures from './MapFeatures';

export default function DrawMap() {
    return (
        <Map>
            <MapFeatures />
            <EditToolbar />
            <SaveAndBackButton />
            <ReviewAndSaveButton />
            <MapControlButtons />
        </Map>
    );
}

function SaveAndBackButton() {
    return (
        <Button
            position='absolute'
            bottom='16px'
            left='32px'
            variant='secondary'
            zIndex={1000}
            fontSize='lg'
            p={6}
        >
            Save and back
        </Button>
    );
}

function ReviewAndSaveButton() {
    return (
        <Button
            position='absolute'
            bottom='16px'
            right='32px'
            variant='cta'
            zIndex={1000}
            fontSize='lg'
            p={6}
            rightIcon={<Icon as={ArrowRightIcon} />}
        >
            Review and submit
        </Button>
    );
}
