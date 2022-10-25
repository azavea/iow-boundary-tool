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
} from '@heroicons/react/outline';
import { CursorClickIcon } from '@heroicons/react/solid';

import AddPolygonIcon from '../../img/AddPolygonIcon.js';
import DeletePolygonConfirmModal from './DeletePolygonConfirmModal.js';
import { useDialogController, useDrawMode } from '../../hooks.js';
import EditPolygonModal from './EditPolygonModal.js';
import {
    cancelAddPolygon,
    startAddPolygon,
    toggleEditMode,
    togglePolygonVisibility,
} from '../../store/mapSlice.js';

const POLYGON_BUTTON_WIDTH = 40;

export default function EditToolbar() {
    const dispatch = useDispatch();
    const { canWrite } = useDrawMode();
    const { polygon, editMode } = useSelector(state => state.map);

    const confirmDeleteDialogController = useDialogController();
    const editDialogController = useDialogController();

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
                                !polygon || polygon?.visible
                                    ? EyeIcon
                                    : EyeOffIcon
                            }
                            onClick={() => dispatch(togglePolygonVisibility())}
                            disabled={!polygon}
                            tooltip='Show/Hide'
                        />
                        <EditToolbarButton
                            icon={CursorClickIcon}
                            onClick={() => dispatch(toggleEditMode())}
                            disabled={!canWrite || !polygon}
                            tooltip='Edit Points'
                            active={canWrite && editMode}
                        />
                        <EditToolbarButton
                            icon={TrashIcon}
                            onClick={confirmDeleteDialogController.open}
                            disabled={!canWrite || !polygon}
                            tooltip='Delete Polygon'
                        />
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
                defaultLabel={polygon?.label}
            />
        </>
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

function PolygonButton({ openEditDialog }) {
    const dispatch = useDispatch();
    const { canWrite } = useDrawMode();
    const { polygon, addPolygonMode } = useSelector(state => state.map);

    if (!canWrite) {
        return (
            <Button variant='toolbar' minW={POLYGON_BUTTON_WIDTH} isDisabled>
                {polygon?.label || ''}
            </Button>
        );
    }

    if (addPolygonMode) {
        return (
            <Button
                onClick={() => dispatch(cancelAddPolygon())}
                w={POLYGON_BUTTON_WIDTH}
            >
                Cancel
            </Button>
        );
    }

    if (polygon) {
        return (
            <Button
                onClick={openEditDialog}
                rightIcon={<Icon as={PencilIcon} />}
                variant='toolbar'
                minW={POLYGON_BUTTON_WIDTH}
            >
                {polygon.label}
            </Button>
        );
    }

    return (
        <Button
            onClick={() => dispatch(startAddPolygon())}
            rightIcon={<AddPolygonIcon />}
            w={POLYGON_BUTTON_WIDTH}
        >
            Draw Polygon
        </Button>
    );
}
