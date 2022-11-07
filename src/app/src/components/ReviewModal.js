import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    Button,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Spacer,
    Text,
    Textarea,
} from '@chakra-ui/react';

import { useFinishReviewMutation } from '../api/reviews';
import { useBoundaryId, useEndpointToastError } from '../hooks';

export default function ReviewModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [notes, setNotes] = useState('');

    const [finishReview, { error, isLoading }] = useFinishReviewMutation();
    useEndpointToastError(error);

    const boundaryId = useBoundaryId();

    const handleSubmit = () => {
        finishReview({ boundaryId, notes })
            .unwrap()
            .then(() => {
                onClose();
                navigate(`/submissions/${boundaryId}`);
            });
    };

    return (
        <Modal size='md' isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader textAlign='center' m={4} mb={2}>
                        Request changes
                    </ModalHeader>
                    <ModalBody mx={4}>
                        <Text mb={2} variant='modalDetailSmall'>
                            Email message
                        </Text>
                        <Textarea
                            value={notes}
                            onChange={event => setNotes(event.target.value)}
                        />
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
                                onClick={handleSubmit}
                                isLoading={isLoading}
                            >
                                Send
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
}
