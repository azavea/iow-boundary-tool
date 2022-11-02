import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useCreateAnnotationMutation } from '../../api/annotations';
import { useBoundaryId, useEndpointToastError } from '../../hooks';

export function AddAnnotationModal({ location, onClose }) {
    const boundaryId = useBoundaryId();

    const [createAnnotation, { error, isLoading }] =
        useCreateAnnotationMutation();
    useEndpointToastError(error);

    const onSubmit = comment => {
        createAnnotation({ boundaryId, comment, location })
            .unwrap()
            .then(onClose);
    };

    return (
        <AnnotationModal
            isOpen={!!location}
            onClose={onClose}
            onSubmit={onSubmit}
            isLoading={isLoading}
            isAdd
        />
    );
}

function AnnotationModal({
    isOpen,
    onClose: externalOnClose,
    onSubmit,
    isLoading,
    isAdd = false,
}) {
    const [comment, setComment] = useState('');

    const onClose = () => {
        setComment('');
        externalOnClose();
    };

    return (
        <Modal size='sm' isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader textAlign='center' m={4} mb={2}>
                        {isAdd ? 'Add' : 'Edit'} comment
                    </ModalHeader>
                    <ModalBody mx={4}>
                        <Textarea
                            value={comment}
                            onChange={event => setComment(event.target.value)}
                        ></Textarea>
                    </ModalBody>
                    <ModalFooter>
                        <Flex w='100%' m={4} mt={2}>
                            <Button
                                variant='secondary'
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                            <Spacer />
                            <Button
                                variant='cta'
                                onClick={() => {
                                    onSubmit(comment);
                                }}
                                isLoading={isLoading}
                            >
                                Save
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
}
