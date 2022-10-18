import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Icon } from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/outline';

import EditToolbar from './EditToolbar';
import MapControlButtons from './MapControlButtons';

import useAddPolygonCursor from './useAddPolygonCursor';
import useEditingPolygon from './useEditingPolygon';
import useGeocoderResult from './useGeocoderResult';
import useTrackMapZoom from './useTrackMapZoom';

import { setPolygon } from '../../store/mapSlice';

export default function DrawTools({ details }) {
    const dispatch = useDispatch();

    // Add the polygon indicated by `details` to the state
    useEffect(() => {
        if (details) {
            dispatch(
                setPolygon({
                    points: details.submission.shape.coordinates[0],
                    visible: true,
                    label: details.utility.name,
                })
            );
        }
    }, [dispatch, details]);

    useEditingPolygon();
    useAddPolygonCursor();
    useGeocoderResult();
    useTrackMapZoom();

    return (
        <>
            <EditToolbar />
            <SaveAndBackButton />
            <ReviewAndSaveButton />
            <MapControlButtons />
        </>
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
