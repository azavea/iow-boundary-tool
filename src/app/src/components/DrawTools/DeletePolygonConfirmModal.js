import { useRef } from 'react';
import {
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    Button,
    Flex,
    Heading,
    Spacer,
} from '@chakra-ui/react';
import { useBoundaryId, useEndpointToastError } from '../../hooks';
import { useDeleteBoundaryShapeMutation } from '../../api/boundaries';

export default function DeletePolygonConfirmModal({ isOpen, onClose }) {
    const cancelRef = useRef();
    const boundaryId = useBoundaryId();

    const [deleteShape, { error }] = useDeleteBoundaryShapeMutation();
    useEndpointToastError(error);

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
                        <Heading size='md'>
                            Are you sure you want to delete the current polygon?
                        </Heading>
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
                                    deleteShape(boundaryId)
                                        .unwrap()
                                        .then(onClose);
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
