import { useState } from 'react';
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
import { useMap } from 'react-leaflet';

import AddPolygonIcon from '../../img/AddPolygonIcon.js';
import { INITIAL_POLYGON_SCALE_FACTOR } from '../../constants';
import EditingPolygon from '../EditingPolygon';
import DeletePolygonConfirmModal from './DeletePolygonConfirmModal.js';
import { useDialogController } from '../../hooks.js';
import EditPolygonModal from './EditPolygonModal.js';

export default function EditToolbar() {
    const [polygon, setPolygon] = useState();
    const [editMode, setEditMode] = useState(false);
    const map = useMap();

    const confirmDeleteDialogController = useDialogController();
    const editDialogController = useDialogController();

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
        setPolygon({
            points: getDefaultPolygon(),
            visible: true,
            label: 'New Polygon',
        });
    };

    const editPolygon = newLabel => {
        setPolygon(polygon => ({
            ...polygon,
            label: newLabel,
        }));
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
                    {polygon ? (
                        <Button
                            onClick={editDialogController.open}
                            rightIcon={<Icon as={PencilIcon} />}
                        >
                            {polygon.label}
                        </Button>
                    ) : (
                        <Button
                            onClick={startPolygon}
                            rightIcon={<AddPolygonIcon />}
                        >
                            Draw Polygon
                        </Button>
                    )}
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
                            tooltip='Show/Hide'
                        />
                        <EditToolbarButton
                            icon={CursorClickIcon}
                            onClick={toggleEditMode}
                            disabled={!polygon}
                            tooltip='Edit Points'
                            active={editMode}
                        />
                        <EditToolbarButton
                            icon={TrashIcon}
                            onClick={confirmDeleteDialogController.open}
                            disabled={!polygon}
                            tooltip='Delete Polygon'
                        />
                    </ButtonGroup>
                </Flex>
            </Box>
            <DeletePolygonConfirmModal
                isOpen={confirmDeleteDialogController.isOpen}
                onConfirm={deletePolygon}
                onClose={confirmDeleteDialogController.close}
            />
            <EditPolygonModal
                isOpen={editDialogController.isOpen}
                onSubmit={editPolygon}
                onClose={editDialogController.close}
                defaultLabel={polygon?.label}
            />
            <EditingPolygon polygon={polygon} editMode={editMode} />
        </>
    );
}

function scaleRange(center, limit) {
    return center + INITIAL_POLYGON_SCALE_FACTOR * (limit - center);
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
