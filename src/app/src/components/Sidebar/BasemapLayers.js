import { useDispatch, useSelector } from 'react-redux';
import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';

import BasemapDefaultImage from '../../img/basemap-default.jpg';
import BasemapLandWaterImage from '../../img/basemap-landwater.jpg';
import BasemapSatelliteImage from '../../img/basemap-satellite.jpg';

import VisibilityButton from './VisbilityButton';

import { setBasemapType, toggleLayer } from '../../store/mapSlice';
import { DATA_LAYERS } from '../../constants';
import { paddingLeft } from './style';

export default function BasemapLayers() {
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
