import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Divider,
    Icon,
    IconButton,
    Tooltip,
} from '@chakra-ui/react';

import {
    EyeIcon,
    TrashIcon,
    EyeOffIcon,
    PencilIcon,
    AnnotationIcon,
} from '@heroicons/react/outline';
import { CursorClickIcon } from '@heroicons/react/solid';

import AddPolygonIcon from '../../img/AddPolygonIcon';
import DeletePolygonConfirmModal from './DeletePolygonConfirmModal';
import { useDialogController } from '../../hooks';
import EditPolygonModal from './EditPolygonModal';
import {
    disableAddCursor,
    enableAddCursor,
    toggleEditMode,
    togglePolygonVisibility,
} from '../../store/mapSlice';
import { useDrawBoundary, useDrawPermissions } from '../DrawContext';
import { BOUNDARY_STATUS } from '../../constants';

const POLYGON_BUTTON_WIDTH = 40;

export default function EditToolbar() {
    const dispatch = useDispatch();
    const boundary = useDrawBoundary();
    const { canWrite, canReview } = useDrawPermissions();
    const { editMode, polygonIsVisible } = useSelector(state => state.map);

    const confirmDeleteDialogController = useDialogController();
    const editDialogController = useDialogController();

    const hasShape = !!boundary.submission?.shape;

    return (
        <>
            <Box
                position='absolute'
                left='22px'
                top='30px'
                zIndex={1000}
                p={2}
                bg='white'
                border='1px solid'
                borderColor='gray.50'
                borderRadius='6px'
                boxShadow='lg'
                cursor='default'
            >
                <Flex>
                    <PolygonButton openEditDialog={editDialogController.open} />
                    <Divider
                        orientation='vertical'
                        mx={4}
                        bgColor='gray.100'
                        opacity={1}
                        h='auto'
                    />
                    <ButtonGroup variant='toolbar'>
                        <EditToolbarButton
                            icon={
                                !hasShape || polygonIsVisible
                                    ? EyeIcon
                                    : EyeOffIcon
                            }
                            onClick={() => dispatch(togglePolygonVisibility())}
                            disabled={!hasShape}
                            tooltip='Show/Hide'
                        />
                        {boundary.status === BOUNDARY_STATUS.DRAFT && (
                            <>
                                <EditToolbarButton
                                    icon={CursorClickIcon}
                                    onClick={() => dispatch(toggleEditMode())}
                                    disabled={!canWrite || !hasShape}
                                    tooltip='Edit Points'
                                    active={canWrite && editMode}
                                />
                                <EditToolbarButton
                                    icon={TrashIcon}
                                    onClick={confirmDeleteDialogController.open}
                                    disabled={!canWrite || !hasShape}
                                    tooltip='Delete Polygon'
                                />
                            </>
                        )}
                        {boundary.status === BOUNDARY_STATUS.IN_REVIEW && (
                            <EditToolbarButton
                                icon={AnnotationIcon}
                                onClick={() => dispatch(enableAddCursor())}
                                disabled={!canReview}
                                tooltip='Add comment'
                            />
                        )}
                    </ButtonGroup>
                </Flex>
            </Box>
            <DeletePolygonConfirmModal
                isOpen={confirmDeleteDialogController.isOpen}
                onClose={confirmDeleteDialogController.close}
            />
            <EditPolygonModal
                isOpen={editDialogController.isOpen}
                onClose={editDialogController.close}
                defaultLabel={boundary.name}
            />
        </>
    );
}

function PolygonButton({ openEditDialog }) {
    const dispatch = useDispatch();
    const boundary = useDrawBoundary();
    const { canWrite } = useDrawPermissions();
    const { showAddCursor } = useSelector(state => state.map);

    const hasShape = !!boundary.submission?.shape;

    if (!canWrite) {
        return (
            <Button variant='toolbar' minW={POLYGON_BUTTON_WIDTH} disabled>
                {boundary.utility.name}
            </Button>
        );
    }

    if (showAddCursor) {
        return (
            <Button
                onClick={() => dispatch(disableAddCursor())}
                w={POLYGON_BUTTON_WIDTH}
            >
                Cancel
            </Button>
        );
    }

    if (hasShape) {
        return (
            <Button
                onClick={openEditDialog}
                rightIcon={<Icon as={PencilIcon} />}
                variant='toolbar'
                minW={POLYGON_BUTTON_WIDTH}
            >
                Replace polygon
            </Button>
        );
    }

    return (
        <Button
            onClick={() => dispatch(enableAddCursor())}
            rightIcon={<AddPolygonIcon />}
            w={POLYGON_BUTTON_WIDTH}
        >
            Draw Polygon
        </Button>
    );
}

function EditToolbarButton({ icon, onClick, disabled, tooltip, active }) {
    return (
        <Tooltip label={tooltip} hasArrow>
            <IconButton
                onClick={onClick}
                icon={<Icon as={icon} fontSize='xl' strokeWidth={1} />}
                disabled={disabled}
                bg={active ? 'gray.100' : undefined}
            />
        </Tooltip>
    );
}
