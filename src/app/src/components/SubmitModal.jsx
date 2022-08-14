import { useState } from 'react';
import {
    Button,
    Flex,
    Heading,
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

import { useSubmitBoundaryMutation } from '../api/boundaries';
import { useBoundaryId, useEndpointToastError } from '../hooks';

export default function SubmitModal({ isOpen, onClose, onSuccess }) {
    const [notes, setNotes] = useState('');

    const handleInputChange = e => {
        const inputValue = e.target.value;
        setNotes(inputValue);
    };

    const [submitBoundary, { error }] = useSubmitBoundaryMutation();
    useEndpointToastError(error);

    const id = useBoundaryId();

    const handleSubmit = () => {
        submitBoundary({ id, payload: { notes } })
            .unwrap()
            .then(() => {
                onSuccess();
                onClose();
            });
    };

    return (
        <Modal
            isOpen={isOpen}
            isCentered
            size='5xl'
            onClose={onClose}
            onSuccess
        >
            <ModalOverlay />
            <ModalContent minH='65vh' p={8}>
                <ModalHeader>
                    <Flex
                        direction='column'
                        mt={19}
                        ml={23}
                        mr={23}
                        alignItems='center'
                    >
                        <Heading size='lg'>Ready to submit?</Heading>
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Flex direction='column' alignItems='center'>
                        <Text mt={2} textStyle='modalDetail'>
                            Please note that your polygon will not be editable
                            while it's being reviewed.
                        </Text>
                    </Flex>
                    <Text mt={12} textStyle='modalDetail'>
                        Is there anything we should know about your submission?
                    </Text>
                    <Textarea
                        value={notes}
                        onChange={handleInputChange}
                        mt={2}
                        height={40}
                    />
                </ModalBody>

                <ModalFooter mt={4}>
                    <Flex w='100%'>
                        <Button mb={4} variant='secondary' onClick={onClose}>
                            Back
                        </Button>
                        <Spacer />
                        <Button mb={4} variant='cta' onClick={handleSubmit}>
                            Submit for review
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
