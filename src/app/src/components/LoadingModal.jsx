import {
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
} from '@chakra-ui/react';

export default function LoadingModal({ isOpen, title }) {
    return (
        <Modal isOpen={isOpen} isCentered size='xs'>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader alignItems='center'>{title ?? ''}</ModalHeader>
                    <ModalBody>
                        <Flex direction='column' alignItems='center'>
                            <Spinner size='xl' />
                        </Flex>
                        <ModalFooter />
                    </ModalBody>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
}
