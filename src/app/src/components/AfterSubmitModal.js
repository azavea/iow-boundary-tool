import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Flex,
    Heading,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Text,
} from '@chakra-ui/react';
import { DownloadIcon, LogoutIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';

import { useBoundaryId } from '../hooks';
import { downloadData } from '../utils';
import { logout } from '../store/authSlice';
import { useDrawBoundary } from './DrawContext';

export default function AfterSubmitModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const id = useBoundaryId();
    const boundary = useDrawBoundary();

    return (
        <Modal
            isOpen={isOpen}
            isCentered
            size='5xl'
            height={4}
            onClose={onClose}
            closeOnOverlayClick={false}
            closeOnEsc={false}
        >
            <ModalOverlay />
            <ModalContent p={8}>
                <ModalHeader>
                    <Flex
                        direction='column'
                        mt={19}
                        ml={23}
                        mr={23}
                        alignItems='center'
                    >
                        <Icon as={CheckCircleIcon} fontSize='5xl' />
                        <Heading size='lg' mt={2}>
                            It's in! Thanks for submitting.
                        </Heading>
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Flex direction='column' alignItems='center'>
                        <Text mt={2} textStyle='modalDetail' align='center'>
                            Keep an eye on your inbox for approval or minor
                            change requests you may need to make before
                            resubmitting.
                        </Text>
                    </Flex>
                </ModalBody>

                <ModalFooter mb={4} w='80%'>
                    <Flex gap={2}>
                        <Button
                            variant='secondary'
                            onClick={() => {
                                navigate(`/submissions/${id}/`);
                            }}
                        >
                            View submission status
                        </Button>
                        <Button
                            variant='secondary'
                            leftIcon={<Icon as={DownloadIcon} />}
                            onClick={() => {
                                downloadData(
                                    JSON.stringify(boundary.submission.shape),
                                    `${boundary.official_name}.geojson`
                                );
                            }}
                        >
                            Download file
                        </Button>
                        <Button
                            variant='cta'
                            rightIcon={<Icon as={LogoutIcon} />}
                            onClick={() => {
                                dispatch(logout());
                                navigate('/login');
                            }}
                        >
                            Sign out
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
