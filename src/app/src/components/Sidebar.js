import { useState } from 'react';
import {
    Box,
    Button,
    Image,
    Divider,
    Flex,
    Heading,
    Icon,
    Text,
    Circle,
} from '@chakra-ui/react';
import {
    MenuIcon,
    QuestionMarkCircleIcon as HelpIcon,
    PlusIcon,
    EyeIcon,
    EyeOffIcon,
} from '@heroicons/react/outline';

import BasemapDefaultImage from '../img/basemap-default.png';
import BasemapSatelliteImage from '../img/basemap-satellite.jpg';

const basemapLayers = [
    'Streets',
    'Parcel data',
    'Municipal boundaries',
    'Land & water',
    'Points of interest',
];

const marginLeft = 4;

export default function Sidebar() {
    return (
        <Flex direction='column'>
            <TitleBar />
            <Divider />
            <ReferenceLayers />
            <Divider />
            <BasemapLayers />
        </Flex>
    );
}

function TitleBar() {
    return (
        <Flex align='center' p={4} mb={2}>
            <Icon color='white' fontSize='2xl' strokeWidth={1} as={MenuIcon} />
            <Heading size='md' color='white' ml={6}>
                Boundary Sync
            </Heading>
        </Flex>
    );
}

function ReferenceLayers() {
    return (
        <Box ml={marginLeft} mt={6} mb={6}>
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
            >
                Upload file
            </Button>
        </Box>
    );
}

function BasemapLayers() {
    const [satelliteMode, setSatelliteMode] = useState(false);
    const [visibility, setVisibility] = useState(() =>
        basemapLayers.reduce(
            (visibility, layer) => ({
                ...visibility,
                [layer]: true,
            }),
            {}
        )
    );

    const toggleVisibility = layer => {
        setVisibility(visibility => ({
            ...visibility,
            [layer]: !visibility[layer],
        }));
    };

    return (
        <Box ml={marginLeft} mr={marginLeft} mt={6}>
            <Heading variant='sidebar' size='sm'>
                Basemap Layers
            </Heading>
            <Flex direction='column' align='flex-start' mt={4}>
                {basemapLayers.map(layer => (
                    <VisibilityButton
                        key={layer}
                        visible={visibility[layer]}
                        onChange={() => toggleVisibility(layer)}
                        label={layer}
                    />
                ))}
            </Flex>
            <Flex mt={2}>
                <ImageButton
                    image={BasemapDefaultImage}
                    label='Default'
                    selected={!satelliteMode}
                    onClick={() => setSatelliteMode(false)}
                />
                <ImageButton
                    image={BasemapSatelliteImage}
                    label='Satellite'
                    selected={satelliteMode}
                    onClick={() => setSatelliteMode(true)}
                />
            </Flex>
        </Box>
    );
}

function VisibilityButton({ label, visible, onChange }) {
    return (
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
        >
            {label}
        </Button>
    );
}

function ImageButton({ image, label, selected, onClick }) {
    return (
        <Box onClick={onClick} p={2} cursor='pointer'>
            <Image
                src={image}
                border='2px solid'
                borderColor={selected ? 'gray.400' : 'transparent'}
                borderRadius='10px'
            />
            <Text color='white'>{label}</Text>
        </Box>
    );
}
