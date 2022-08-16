import { useRef, useState } from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Divider,
    Icon,
    IconButton,
    Spacer,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
} from '@chakra-ui/react';

import { EyeIcon, TrashIcon, EyeOffIcon } from '@heroicons/react/outline';
import { CursorClickIcon } from '@heroicons/react/solid';
import { useMap } from 'react-leaflet';

import AddPolygonIcon from '../img/AddPolygonIcon.js';
import { INITIAL_POLYGON_SCALE_FACTOR } from '../constants';
import EditingPolygon from './EditingPolygon';

export default function EditToolbar() {
    const [polygon, setPolygon] = useState();
    const [editMode, setEditMode] = useState(false);
    const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] =
        useState(false);

    const map = useMap();

    const openConfirmDeleteDialog = () => setShowConfirmDeleteDialog(true);
    const closeConfirmDeleteDialog = () => setShowConfirmDeleteDialog(false);

    const getDefaultPolygon = () => {
        const bounds = map.getBounds();
        const center = bounds.getCenter();
        const west = scaleRange(center.lng, bounds.getWest());
        const east = scaleRange(center.lng, bounds.getEast());
        const north = scaleRange(center.lat, bounds.getNorth());
        const south = scaleRange(center.lat, bounds.getSouth());

        return [
            [north, west],
            [north, east],
            [south, east],
            [south, west],
        ];
    };

    const startPolygon = () => {
        setEditMode(true);
        setPolygon({ points: getDefaultPolygon(), visible: true });
    };

    const deletePolygon = () => {
        setPolygon(null);
    };

    const toggleVisibility = () => {
        setPolygon(polygon =>
            polygon ? { ...polygon, visible: !polygon.visible } : null
        );
    };

    const toggleEditMode = () => {
        setEditMode(editMode => !editMode);
    };

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
            >
                <Flex>
                    <Button
                        onClick={startPolygon}
                        rightIcon={<AddPolygonIcon />}
                    >
                        Draw Polygon
                    </Button>
                    <Divider
                        // TODO: Figure out why this divider does not show up
                        orientation='vertical'
                        ml={2}
                        mr={2}
                        color='gray.100'
                        opacity={1}
                    />
                    <ButtonGroup variant='toolbar'>
                        <EditToolbarButton
                            icon={
                                !polygon || polygon?.visible
                                    ? EyeIcon
                                    : EyeOffIcon
                            }
                            onClick={toggleVisibility}
                            disabled={!polygon}
                        />
                        <EditToolbarButton
                            icon={CursorClickIcon}
                            onClick={toggleEditMode}
                            disabled={!polygon}
                        />
                        <EditToolbarButton
                            icon={TrashIcon}
                            onClick={openConfirmDeleteDialog}
                            disabled={!polygon}
                        />
                    </ButtonGroup>
                </Flex>
                <DeletePolygonConfirmModal
                    isOpen={showConfirmDeleteDialog}
                    onConfirm={deletePolygon}
                    onClose={closeConfirmDeleteDialog}
                />
            </Box>
            <EditingPolygon polygon={polygon} editMode={editMode} />
        </>
    );
}

function DeletePolygonConfirmModal({ isOpen, onConfirm, onClose }) {
    const cancelRef = useRef();

    return (
        <AlertDialog
            size='sm'
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            leastDestructiveRef={cancelRef}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader textAlign='center' m={4} mb={2}>
                        Are you sure you want to delete the current polygon?
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Flex w='100%' m={4} mt={2}>
                            <Button
                                variant='secondary'
                                onClick={onClose}
                                ref={cancelRef}
                            >
                                Back
                            </Button>
                            <Spacer />
                            <Button
                                variant='cta'
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                            >
                                Yes, Delete
                            </Button>
                        </Flex>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}

function scaleRange(center, limit) {
    return center + INITIAL_POLYGON_SCALE_FACTOR * (limit - center);
}

function EditToolbarButton({ icon, onClick, disabled }) {
    return (
        <IconButton
            onClick={onClick}
            icon={<Icon as={icon} fontSize='xl' strokeWidth={1} />}
            disabled={disabled}
        />
    );
}
