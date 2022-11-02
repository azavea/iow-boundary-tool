import {
    Box,
    Button,
    Container,
    Image,
    Divider,
    Flex,
    Heading,
    Icon,
    Text,
    Circle,
    Tooltip,
} from '@chakra-ui/react';
import {
    QuestionMarkCircleIcon as HelpIcon,
    PlusIcon,
    EyeIcon,
    EyeOffIcon,
} from '@heroicons/react/outline';

import BasemapDefaultImage from '../img/basemap-default.jpg';
import BasemapLandWaterImage from '../img/basemap-landwater.jpg';
import BasemapSatelliteImage from '../img/basemap-satellite.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { setBasemapType, toggleLayer } from '../store/mapSlice';
import { DATA_LAYERS, SIDEBAR_TEXT_TOOLTIP_THRESHOLD } from '../constants';
import { useBoundaryId, useEndpointToastError, useFilePicker } from '../hooks';
import {
    useDebouncedUpdateReferenceImageMutation,
    useUploadReferenceImageMutation,
} from '../api/referenceImages';
import { useDrawBoundary, useDrawPermissions } from './DrawContext';

const paddingLeft = 4;

export default function Sidebar() {
    return (
        <Container pl={paddingLeft} maxW='xs' bg='gray.700' p={0}>
            <Flex direction='column'>
                <Divider />
                <ReferenceLayers />
                <Divider />
                <BasemapLayers />
            </Flex>
        </Container>
    );
}

function ReferenceLayers() {
    const boundaryId = useBoundaryId();
    const boundary = useDrawBoundary();
    const { canWrite } = useDrawPermissions();

    const [createReferenceImage, { createReferenceImageError }] =
        useUploadReferenceImageMutation();

    const [updateReferenceImage, { updateReferenceImageError }] =
        useDebouncedUpdateReferenceImageMutation(boundaryId, canWrite);

    useEndpointToastError(
        createReferenceImageError ?? updateReferenceImageError
    );

    const uploadImage = file => {
        createReferenceImage({
            boundaryId,
            filename: file.name,
            is_visible: true,
            distortion: null,
            opacity: 100,
            file,
        });
    };

    // TODO support multiple files
    const openFileDialog = useFilePicker(files => files.map(uploadImage));

    return (
        <Box ml={paddingLeft} mt={6} mb={6}>
            <Flex mb={4} align='center'>
                <Heading variant='sidebar' size='sm'>
                    Reference Layers
                </Heading>
                <Icon color='white' as={HelpIcon} ml={2} />
            </Flex>
            <Button
                bg='gray.500'
                color='white'
                variant='button'
                leftIcon={<Icon as={PlusIcon} />}
                mb={4}
                onClick={openFileDialog}
                disabled={!canWrite}
            >
                Upload file
            </Button>
            <Flex direction='column' align='flex-start'>
                {boundary.reference_images.map(image => (
                    <VisibilityButton
                        key={image.id}
                        visible={image.is_visible}
                        onChange={() => {
                            updateReferenceImage({
                                ...image,
                                is_visible: !image.is_visible,
                            });
                        }}
                        label={image.filename}
                    />
                ))}
            </Flex>
        </Box>
    );
}

function BasemapLayers() {
    const dispatch = useDispatch();
    const { layers, basemapType, mapZoom } = useSelector(state => state.map);

    const toggleVisibility = layer => {
        dispatch(toggleLayer(layer));
    };

    return (
        <Box ml={paddingLeft} mr={paddingLeft} mt={6}>
            <Heading variant='sidebar' size='sm'>
                Basemap Layers
            </Heading>
            <Flex direction='column' align='flex-start' mt={4}>
                {Object.entries(DATA_LAYERS).map(
                    ([layer, { label, minZoom }]) => (
                        <VisibilityButton
                            key={layer}
                            visible={layers.includes(layer)}
                            onChange={() => toggleVisibility(layer)}
                            label={label}
                            disabled={!!minZoom && mapZoom < minZoom}
                        />
                    )
                )}
            </Flex>
            <Box mt={2}>
                <ImageButton
                    image={BasemapDefaultImage}
                    label='Default'
                    selected={basemapType === 'default'}
                    onClick={() => dispatch(setBasemapType('default'))}
                />
                <ImageButton
                    image={BasemapLandWaterImage}
                    label='Land & water'
                    selected={basemapType === 'landwater'}
                    onClick={() => dispatch(setBasemapType('landwater'))}
                />
                <ImageButton
                    image={BasemapSatelliteImage}
                    label='Satellite'
                    selected={basemapType === 'satellite'}
                    onClick={() => dispatch(setBasemapType('satellite'))}
                />
            </Box>
        </Box>
    );
}

function VisibilityButton({ label, visible, onChange, disabled = false }) {
    return (
        <Tooltip
            label={label}
            bg='gray.500'
            hasArrow
            isDisabled={label?.length <= SIDEBAR_TEXT_TOOLTIP_THRESHOLD}
        >
            <Button
                mb={1}
                leftIcon={
                    <Circle
                        color='white'
                        bg={visible ? 'gray.500' : 'gray.600'}
                        mr={2}
                    >
                        <Icon
                            as={visible ? EyeIcon : EyeOffIcon}
                            m={2}
                            fontSize='lg'
                            strokeWidth={1}
                        />
                    </Circle>
                }
                onClick={onChange}
                variant='link'
                color={visible ? 'gray.300' : 'gray.500'}
                textDecoration='none'
                fontWeight={600}
                disabled={disabled}
            >
                {label}
            </Button>
        </Tooltip>
    );
}

function ImageButton({ image, label, selected, onClick }) {
    return (
        <Box onClick={onClick} p={2} cursor='pointer' display='inline-block'>
            <Image
                src={image}
                border='2px solid'
                borderColor={selected ? 'gray.400' : 'transparent'}
                borderRadius='10px'
                width='120px'
                height='80px'
            />
            <Text color='white' fontSize='sm'>
                {label}
            </Text>
        </Box>
    );
}
