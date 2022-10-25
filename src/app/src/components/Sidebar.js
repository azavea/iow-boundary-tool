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
import {
    setBasemapType,
    toggleLayer,
    toggleReferenceImageVisibility,
} from '../store/mapSlice';
import {
    DATA_LAYERS,
    DRAW_MODES,
    SIDEBAR_TEXT_TOOLTIP_THRESHOLD,
} from '../constants';
import { useAddReferenceImage, useDrawMode, useFilePicker } from '../hooks';

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
    const dispatch = useDispatch();
    const addReferenceImage = useAddReferenceImage();
    const openFileDialog = useFilePicker(files => files.map(addReferenceImage));
    const drawMode = useDrawMode();

    const images = useSelector(state => state.map.referenceImages);

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
                disabled={drawMode !== DRAW_MODES.WRITE}
            >
                Upload file
            </Button>
            <Flex direction='column' align='flex-start'>
                {Object.entries(images).map(([url, image]) => (
                    <VisibilityButton
                        key={url}
                        visible={image.visible}
                        onChange={() =>
                            dispatch(toggleReferenceImageVisibility(url))
                        }
                        label={image.name}
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
            isDisabled={label.length <= SIDEBAR_TEXT_TOOLTIP_THRESHOLD}
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
