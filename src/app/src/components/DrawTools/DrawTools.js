import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Icon } from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/outline';

import ReferenceImageLayer from '../Layers/ReferenceImageLayer';
import EditToolbar from './EditToolbar';
import MapControlButtons from './MapControlButtons';

import { useDialogController } from '../../hooks';
import { useDrawBoundary } from '../DrawContext';

import useAddPolygonCursor from './useAddPolygonCursor';
import useEditingPolygon from './useEditingPolygon';
import useGeocoderResult from './useGeocoderResult';
import useTrackMapZoom from './useTrackMapZoom';

import { setPolygon } from '../../store/mapSlice';
import { BOUNDARY_STATUS } from '../../constants';

import SubmitModal from '../SubmitModal';
import AfterSubmitModal from '../AfterSubmitModal';

export default function DrawTools() {
    const details = useDrawBoundary();
    const dispatch = useDispatch();

    // Add the polygon indicated by `details` to the state
    useEffect(() => {
        if (details?.submission?.shape) {
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

    const submitDialogController = useDialogController(false);
    const afterSubmitDialogController = useDialogController(
        details.status === BOUNDARY_STATUS.SUBMITTED
    );

    return (
        <>
            <ReferenceImageLayer images={details.reference_images} />
            <EditToolbar />
            <SaveAndBackButton />
            <SubmitModal
                isOpen={submitDialogController.isOpen}
                onClose={submitDialogController.close}
                onSuccess={afterSubmitDialogController.open}
            />
            <AfterSubmitModal
                isOpen={afterSubmitDialogController.isOpen}
                onClose={afterSubmitDialogController.close}
            />
            <ReviewAndSaveButton onClick={submitDialogController.open} />
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

function ReviewAndSaveButton({ onClick }) {
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
            onClick={onClick}
        >
            Review and submit
        </Button>
    );
}
