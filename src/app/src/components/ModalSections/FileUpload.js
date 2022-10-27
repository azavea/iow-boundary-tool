import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    List,
    ListItem,
    Text,
    useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CloudUploadIcon } from '@heroicons/react/outline';

import ModalSection from './ModalSection';
import {
    convertIndexedObjectToArray,
    fileIsImageFile,
    fileIsShapeFile,
} from '../../utils';
import { useEndpointToastError, useFilePicker } from '../../hooks';
import { useStartNewBoundaryMutation } from '../../api/boundaries';

export default function FileUpload({ PreviousButton }) {
    const toast = useToast();
    const navigate = useNavigate();
    const utilityId = useSelector(state => state.auth.utility.id);

    const [startNewBoundary, { error }] = useStartNewBoundaryMutation();
    useEndpointToastError(error);

    const [files, setFiles] = useState([]);
    const addFiles = newFiles => setFiles(files => [...files, ...newFiles]);

    const handleContinue = () => {
        const referenceImages = files.filter(fileIsImageFile);
        const shapeFiles = files.filter(fileIsShapeFile);

        if (shapeFiles.length > 1) {
            toast({
                title: 'Only one shapefile may be uploaded at a time.',
                status: 'error',
                isClosable: true,
                duration: 5000,
            });
            return;
        }

        startNewBoundary({
            utility_id: utilityId,
            reference_images: referenceImages,
            shape: shapeFiles?.[0],
        })
            .unwrap()
            .then(id => navigate(`/draw/${id}`));
    };

    return (
        <ModalSection
            preHeading='Optional'
            heading='Would you like to add your current map?'
            prevButton={PreviousButton}
            nextButton={
                <Button variant='cta' onClick={handleContinue}>
                    Continue
                </Button>
            }
        >
            <Text>
                If you would like to look at a reference or start from an
                existing map you can upload it here. If you have a Shapefile, we
                recommend adding it.
            </Text>

            <Flex mt={4} w='100%' grow>
                <UploadBox addFiles={addFiles} />
                <FilesBox files={files} />
            </Flex>
        </ModalSection>
    );
}

function UploadBox({ addFiles }) {
    const { hovering, handleUpload, startDrag, endDrag } =
        useFileUpload(addFiles);

    const openFileDialog = useFilePicker(addFiles);

    const onLeaveDragBox = event => {
        const enteredElement = event.relatedTarget;
        if (elementIsNotInDragBox(enteredElement)) {
            endDrag();
        }
    };

    const elementIsNotInDragBox = element =>
        !document.getElementById('drop_zone').contains(element);

    return (
        <Box
            id='drop_zone'
            w='50%'
            onDrop={handleUpload}
            onDragEnter={startDrag}
            onDragLeave={onLeaveDragBox}
            onDragEnd={endDrag}
            onDragOver={event => event.preventDefault()}
            border='1px dashed'
            borderColor={hovering ? 'gray.900' : 'gray.200'}
            borderRadius='6px'
            bg={hovering ? 'rgba(0, 0, 0, 0.1)' : undefined}
        >
            <Flex
                p={8}
                direction='column'
                textAlign='center'
                align='center'
                justify='center'
            >
                <CloudIconWithBackground />
                <Text mb={2} fontFamily="'Inter', san-serif">
                    Drag &amp; drop files here or
                </Text>
                <Button
                    mb={6}
                    variant='primary'
                    maxW='162px'
                    onClick={openFileDialog}
                >
                    Browse files
                </Button>
                <Text color='gray.400' mb={4}>
                    <Bold>ACCEPTED FILES</Bold>
                </Text>
                <Text color='gray.400'>
                    <Bold>Shapefiles:</Bold> .SHP, .SHX and .DBF
                    <br />
                    <Bold>Other map files:</Bold> JPEG, PNG
                </Text>
            </Flex>
        </Box>
    );
}

function useFileUpload(onChange) {
    const [hovering, setHovering] = useState(false);
    usePreventBackgroundUpload();

    const handleUpload = event => {
        event.preventDefault();
        endDrag();

        if (!event.dataTransfer.items) return;

        var files = convertIndexedObjectToArray(event.dataTransfer.items)
            .filter(item => item.kind === 'file')
            .map(item => item.getAsFile());

        onChange(files);
    };

    const startDrag = () => setHovering(true);
    const endDrag = () => setHovering(false);

    return {
        hovering,
        handleUpload,
        startDrag,
        endDrag,
    };
}

function usePreventBackgroundUpload() {
    useEffect(() => {
        const preventDefault = event => {
            event.preventDefault();
        };

        window.addEventListener('drop', preventDefault);
        window.addEventListener('dragover', preventDefault);

        return () => {
            window.removeEventListener('drop', preventDefault);
            window.removeEventListener('dragover', preventDefault);
        };
    }, []);
}

function CloudIconWithBackground() {
    return (
        <Flex
            borderRadius='50%'
            bg='gray.100'
            w='80px'
            h='80px'
            align='center'
            mb={2}
        >
            <Icon
                as={CloudUploadIcon}
                w='40px'
                h='40px'
                color='gray.500'
                flexGrow={1}
                strokeWidth={1}
            />
        </Flex>
    );
}

function Bold({ children }) {
    return (
        <span style={{ fontWeight: '600', fontFamily: "'Inter', sans-serif" }}>
            {children}
        </span>
    );
}

function FilesBox({ files }) {
    if (files.length === 0) return null;

    return (
        <Box w='50%' pl={4}>
            <Heading pb={4} size='small'>
                Uploaded Files
            </Heading>
            <List>
                {files.map(({ name }) => (
                    <ListItem key={name} mb={6}>
                        <Text mb={2} p={2} color='gray.700' bg='gray.50'>
                            {name}
                        </Text>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
