import { Button, Icon } from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/outline';

import EditToolbar from './EditToolbar';
import MapControlButtons from './MapControlButtons';

import { useDialogController } from '../../hooks';
import { useDrawBoundary, useDrawPermissions } from '../DrawContext.js';

import useAddPolygonCursor from './useAddPolygonCursor';
import useEditingPolygon from './useEditingPolygon';
import useGeocoderResult from './useGeocoderResult';
import useTrackMapZoom from './useTrackMapZoom';

import SubmitModal from '../SubmitModal';
import AfterSubmitModal from '../AfterSubmitModal';

export default function DrawTools() {
    useEditingPolygon();
    useAddPolygonCursor();
    useGeocoderResult();
    useTrackMapZoom();

    const submitDialogController = useDialogController(false);
    const afterSubmitDialogController = useDialogController(false);

    const { canWrite } = useDrawPermissions();

    return (
        <>
            <EditToolbar />
            <SubmitModal
                isOpen={submitDialogController.isOpen}
                onClose={submitDialogController.close}
                onSuccess={afterSubmitDialogController.open}
            />
            <AfterSubmitModal
                isOpen={afterSubmitDialogController.isOpen}
                onClose={afterSubmitDialogController.close}
            />
            {canWrite && (
                <ReviewAndSaveButton onClick={submitDialogController.open} />
            )}
            <MapControlButtons />
        </>
    );
}

function ReviewAndSaveButton({ onClick }) {
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
            Review and submit
        </Button>
    );
}
