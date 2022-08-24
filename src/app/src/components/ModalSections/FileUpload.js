import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    List,
    ListItem,
    Progress,
    Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CloudUploadIcon } from '@heroicons/react/outline';

import { convertIndexedObjectToArray } from '../../utils';
import ModalSection from './ModalSection';

export default function FileUpload({ PreviousButton }) {
    const navigate = useNavigate();

    const [files, setFiles] = useState([]);

    const addFiles = newFiles => setFiles(files => [...files, ...newFiles]);

    return (
        <ModalSection
            preHeading='Optional'
            heading='Would you like to add your current map?'
            prevButton={PreviousButton}
            nextButton={
                <Button variant='cta' onClick={() => navigate('/draw')}>
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
                <UploadBox setFiles={addFiles} />
                <FilesBox files={files}></FilesBox>
            </Flex>
        </ModalSection>
    );
}

function UploadBox({ setFiles }) {
    const { hovering, handleUpload, startDrag, endDrag } =
        useFileUpload(setFiles);

    const openFileDialog = useFilePicker(setFiles);

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
                    <Bold>Other map files:</Bold> PDF, JPEG, PNG, TIFF
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

function useFilePicker(onChange) {
    const openFileDialog = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = handlePickFiles;

        input.click();
    };

    const handlePickFiles = event => {
        onChange(convertIndexedObjectToArray(event.target.files));
        event.target.remove();
    };

    return openFileDialog;
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
                {files.map(file => (
                    <ListItem key={file.name} mb={6}>
                        <Text mb={2} p={2} color='gray.700' bg='gray.50'>
                            {file.name}
                        </Text>
                        <Progress
                            colorScheme='gray'
                            size='xs'
                            isIndeterminate
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
