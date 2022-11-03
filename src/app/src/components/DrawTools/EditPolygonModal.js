import {
    Button,
    Flex,
    Spacer,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Input,
    ModalBody,
} from '@chakra-ui/react';
import { CloudUploadIcon } from '@heroicons/react/outline';

import { ACCEPT_SHAPES } from '../../constants';
import { useBoundaryId, useFilePicker } from '../../hooks';
import { useReplaceBoundaryShapeMutation } from '../../api/boundaries';

export default function EditPolygonModal({ isOpen, label, onClose }) {
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
                        Edit polygon
                    </ModalHeader>
                    <ModalBody mx={4}>
                        <Input value={label} disabled />
                    </ModalBody>
                    <ModalFooter>
                        <Flex w='100%' m={4} mt={2}>
                            <Button
                                variant='secondary'
                                leftIcon={<Icon as={CloudUploadIcon} />}
                                onClick={openFileDialog}
                                isLoading={isLoading}
                            >
                                Upload File
                            </Button>
                            <Spacer />
                            <Button
                                variant='cta'
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
}
