import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Icon } from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/outline';

import ReferenceImageLayer from '../Layers/ReferenceImageLayer';
import EditToolbar from './EditToolbar';
import MapControlButtons from './MapControlButtons';

import { useGetBoundaryDetailsQuery } from '../../api/boundaries';
import {
    useBoundaryId,
    useDialogController,
    useEndpointToastError,
} from '../../hooks';

import useAddPolygonCursor from './useAddPolygonCursor';
import useEditingPolygon from './useEditingPolygon';
import useGeocoderResult from './useGeocoderResult';
import useTrackMapZoom from './useTrackMapZoom';

import { setPolygon } from '../../store/mapSlice';
import { BOUNDARY_STATUS, ROLES } from '../../constants';
import LoadingModal from '../LoadingModal';
import SubmitModal from '../SubmitModal';
import AfterSubmitModal from '../AfterSubmitModal';

const DRAW_MODES = {
    FULLY_EDITABLE: 'fully_editable',
    ANNOTATIONS_ONLY: 'annotations_only',
    READ_ONLY: 'read_only',
};

export default function LoadBoundaryDetails() {
    const user = useSelector(state => state.auth.user);
    const id = useBoundaryId();

    const { isFetching, data: details, error } = useGetBoundaryDetailsQuery(id);
    useEndpointToastError(error);

    if (isFetching) {
        return <LoadingModal isOpen title='Loading boundary data...' />;
    }

    if (error || typeof details !== 'object') {
        return null;
    }

    const mode = getDrawMode({ status: details.status, userRole: user.role });

    return <DrawTools mode={mode} details={details} />;
}

function DrawTools({ mode, details }) {
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

function getDrawMode({ status, userRole }) {
    if (userRole === ROLES.VALIDATOR && status === BOUNDARY_STATUS.IN_REVIEW) {
        return DRAW_MODES.ANNOTATIONS_ONLY;
    }

    if (status === BOUNDARY_STATUS.DRAFT && userRole === ROLES.CONTRIBUTOR) {
        return DRAW_MODES.FULLY_EDITABLE;
    }

    return DRAW_MODES.READ_ONLY;
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
