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

import { EyeIcon, TrashIcon } from '@heroicons/react/outline';
import { CursorClickIcon } from '@heroicons/react/solid';

import AddPolygonIcon from '../img/AddPolygonIcon.js';
import { INITIAL_POLYGON_SCALE_FACTOR } from '../constants';

export default function EditToolbar() {
    const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] =
        useState(false);

    const openConfirmDeleteDialog = () => setShowConfirmDeleteDialog(true);
    const closeConfirmDeleteDialog = () => setShowConfirmDeleteDialog(false);

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
                        <EditToolbarButton icon={EyeIcon} />
                        <EditToolbarButton icon={CursorClickIcon} />
                        <EditToolbarButton
                            icon={TrashIcon}
                            onClick={openConfirmDeleteDialog}
                        />
                    </ButtonGroup>
                </Flex>
                <DeletePolygonConfirmModal
                    isOpen={showConfirmDeleteDialog}
                    onClose={closeConfirmDeleteDialog}
                />
            </Box>
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

function EditToolbarButton({ icon, onClick, disabled }) {
    return (
        <IconButton
            onClick={onClick}
            icon={<Icon as={icon} fontSize='xl' strokeWidth={1} />}
            disabled={disabled}
        />
    );
}
