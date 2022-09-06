import { useState, useEffect } from 'react';
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
import { useDispatch } from 'react-redux';
import { renamePolygon } from '../../store/mapSlice';

export default function EditPolygonModal({ isOpen, defaultLabel, onClose }) {
    const dispatch = useDispatch();
    const [label, setLabel] = useState(defaultLabel);

    useEffect(() => setLabel(defaultLabel), [defaultLabel]);

    return (
        <Modal size='sm' isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader textAlign='center' m={4} mb={2}>
                        Edit polygon
                    </ModalHeader>
                    <ModalBody mx={4}>
                        <Input
                            value={label}
                            onChange={({ target: { value } }) =>
                                setLabel(value)
                            }
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Flex w='100%' m={4} mt={2}>
                            <Button
                                variant='secondary'
                                leftIcon={<Icon as={CloudUploadIcon} />}
                            >
                                Upload File
                            </Button>
                            <Spacer />
                            <Button
                                variant='cta'
                                onClick={() => {
                                    dispatch(renamePolygon(label));
                                    onClose();
                                }}
                            >
                                Save changes
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
}
