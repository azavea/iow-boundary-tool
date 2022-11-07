import { Button, Icon } from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/outline';

import EditToolbar from './EditToolbar';
import MapControlButtons from './MapControlButtons';

import { useDialogController } from '../../hooks';
import { useDrawBoundary, useDrawPermissions } from '../DrawContext.js';

import useEditingPolygon from './useEditingPolygon';
import useGeocoderResult from './useGeocoderResult';
import useTrackMapZoom from './useTrackMapZoom';

import SubmitModal from '../SubmitModal';
import AfterSubmitModal from '../AfterSubmitModal';
import ReviewModal from '../ReviewModal';
import AddPolygon from './AddPolygon';
import AddAnnotation from './AddAnnotation';

import { BOUNDARY_STATUS, SUBMIT_REVIEW_BUTTON_TEXT } from '../../constants';
import AnnotationMarkers from './AnnotationMarkers';

export default function DrawTools() {
    useEditingPolygon();
    useGeocoderResult();
    useTrackMapZoom();

    const { status } = useDrawBoundary();
    const { canWrite, canReview } = useDrawPermissions();

    const draftMode = status === BOUNDARY_STATUS.DRAFT && canWrite;
    const reviewMode = status === BOUNDARY_STATUS.IN_REVIEW && canReview;

    return (
        <>
            <EditToolbar />
            <MapControlButtons />

            {draftMode && <DraftTools />}
            {reviewMode && <ReviewTools />}

            <AnnotationMarkers />
        </>
    );
}

function DraftTools() {
    const submitDialogController = useDialogController(false);
    const afterSubmitDialogController = useDialogController(false);

    return (
        <>
            <AddPolygon />

            <SubmitModal
                isOpen={submitDialogController.isOpen}
                onClose={submitDialogController.close}
                onSuccess={afterSubmitDialogController.open}
            />
            <AfterSubmitModal
                isOpen={afterSubmitDialogController.isOpen}
                onClose={afterSubmitDialogController.close}
            />

            <ReviewAndSaveButton
                onClick={submitDialogController.open}
                text='Review and submit'
            />
        </>
    );
}

function ReviewTools() {
    const reviewDialogController = useDialogController(false);

    return (
        <>
            <AddAnnotation />

            <ReviewModal
                isOpen={reviewDialogController.isOpen}
                onClose={reviewDialogController.close}
            />

            <ReviewAndSaveButton
                onClick={reviewDialogController.open}
                text={SUBMIT_REVIEW_BUTTON_TEXT}
            />
        </>
    );
}

function ReviewAndSaveButton({ onClick, text }) {
    const hasShape = !!useDrawBoundary().submission?.shape;

    return (
        <Button
            position='absolute'
            bottom='32px'
            right='32px'
            variant='cta'
            zIndex={1000}
            fontSize='lg'
            p={6}
            rightIcon={<Icon as={ArrowRightIcon} />}
            onClick={onClick}
            isDisabled={!hasShape}
            _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
            _hover={!hasShape ? { opacity: 0.7 } : {}}
        >
            {text}
        </Button>
    );
}
