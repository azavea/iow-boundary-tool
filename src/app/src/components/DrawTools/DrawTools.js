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

import SubmitModal from '../SubmitModal';
import AfterSubmitModal from '../AfterSubmitModal';

import { BOUNDARY_STATUS } from '../../constants';

export default function DrawTools() {
    const { status, reference_images } = useDrawBoundary();

    useEditingPolygon();
    useAddPolygonCursor();
    useGeocoderResult();
    useTrackMapZoom();

    const submitDialogController = useDialogController(false);
    const afterSubmitDialogController = useDialogController(
        status === BOUNDARY_STATUS.SUBMITTED
    );

    return (
        <>
            <ReferenceImageLayer images={reference_images} />
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
