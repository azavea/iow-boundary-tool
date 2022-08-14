import { Box, HStack, Icon, IconButton, VStack } from '@chakra-ui/react';

import {
    SearchIcon,
    PlusIcon,
    MinusIcon,
    XIcon,
} from '@heroicons/react/outline';
import { useMap } from 'react-leaflet';
import { useDispatch } from 'react-redux';

import { useDialogController, usePreventMapDoubleClick } from '../../hooks';
import { clearGeocodeResult } from '../../store/mapSlice';
import Geocoder from '../Geocoder';

export default function MapControlButtons() {
    const dispatch = useDispatch();
    const map = useMap();
    const geocoderController = useDialogController();

    return (
        <Box
            position='absolute'
            top='30px'
            right='32px'
            zIndex={1000}
            flexDirection='column'
        >
            <VStack direction='column' spacing='6px' alignItems='end'>
                <HStack>
                    <Geocoder
                        isOpen={geocoderController.isOpen}
                        onClose={geocoderController.close}
                    />
                    {geocoderController.isOpen ? (
                        <MapControlButton
                            icon={XIcon}
                            onClick={() => {
                                dispatch(clearGeocodeResult());
                                geocoderController.close();
                            }}
                        />
                    ) : (
                        <MapControlButton
                            icon={SearchIcon}
                            onClick={geocoderController.open}
                        />
                    )}
                </HStack>
                <MapControlButton
                    icon={PlusIcon}
                    onClick={() => map.zoomIn()}
                />
                <MapControlButton
                    icon={MinusIcon}
                    onClick={() => map.zoomOut()}
                />
            </VStack>
        </Box>
    );
}

function MapControlButton({ icon, onClick }) {
    const ref = usePreventMapDoubleClick();

    return (
        <IconButton
            ref={ref}
            onClick={onClick}
            variant='toolbar'
            icon={<Icon as={icon} fontSize='xl' strokeWidth={1} />}
        />
    );
}
