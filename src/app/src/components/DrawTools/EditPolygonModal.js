import {
    Button,
    Flex,
    Spacer,
    Heading,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
} from '@chakra-ui/react';
import { CloudUploadIcon } from '@heroicons/react/outline';

import { ACCEPT_SHAPES } from '../../constants';
import { useBoundaryId, useFilePicker } from '../../hooks';
import { useReplaceBoundaryShapeMutation } from '../../api/boundaries';

export default function EditPolygonModal({ isOpen, onClose }) {
    const [replaceShape, { isLoading }] = useReplaceBoundaryShapeMutation();
    const id = useBoundaryId();

    const uploadShape = file =>
        replaceShape({ id, file }).unwrap().then(onClose);

    const openFileDialog = useFilePicker({
        onChange: files => uploadShape(files[0]),
        multiple: false,
        accept: ACCEPT_SHAPES,
    });

    return (
        <Modal size='sm' isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader textAlign='center' m={4} mb={2}>
                        <Heading size='md'>Replace polygon</Heading>
                    </ModalHeader>
                    <ModalFooter>
                        <Flex w='100%' m={4} mt={2}>
                            <Button
                                variant='secondary'
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Spacer />
                            <Button
                                variant='cta'
                                leftIcon={<Icon as={CloudUploadIcon} />}
                                onClick={openFileDialog}
                                isLoading={isLoading}
                            >
                                Upload new file
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
}
