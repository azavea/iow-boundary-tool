import { useRef } from 'react';
import {
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    Button,
    Flex,
    Spacer,
} from '@chakra-ui/react';

export default function DeletePolygonConfirmModal({
    isOpen,
    onConfirm,
    onClose,
}) {
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
