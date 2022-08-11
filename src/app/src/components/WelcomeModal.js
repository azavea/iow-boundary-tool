import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalHeader,
    Heading,
    Text,
} from '@chakra-ui/react';

export default function WelcomeModal() {
    return (
        <Modal isOpen isCentered size={'5xl'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading size='lg'>Welcome to BoundarySync</Heading>
                </ModalHeader>
                <ModalBody>
                    <Text>
                        Build a digital map of your service area boundary in
                        minutes for free. No complex software or training
                        needed.
                    </Text>
                    <Button variant='link'>Learn more &gt;</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
