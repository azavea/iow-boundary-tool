import { Box, Icon, IconButton, VStack } from '@chakra-ui/react';

import { SearchIcon, PlusIcon, MinusIcon } from '@heroicons/react/outline';
import { useMap, useMapEvent } from 'react-leaflet';
import { DRAW_MAP_ID } from '../../constants';

export default function MapControlButtons() {
    const map = useMap();

    useMapEvent('dblclick', event => {
        if (event.originalEvent.target.id === DRAW_MAP_ID) {
            // TODO: Find some way to prevent map recentering
            return false;
        }
    });

    const zoomIn = event => {
        map.zoomIn();
    };

    const zoomOut = event => {
        map.zoomOut();
    };

    return (
        <Box
            position='absolute'
            top='30px'
            right='32px'
            zIndex={1000}
            flexDirection='column'
        >
            <VStack direction='column' spacing='6px'>
                <MapControlButton icon={SearchIcon} />
                <MapControlButton icon={PlusIcon} onClick={zoomIn} />
                <MapControlButton icon={MinusIcon} onClick={zoomOut} />
            </VStack>
        </Box>
    );
}

function MapControlButton({ icon, onClick }) {
    return (
        <IconButton
            onClick={onClick}
            variant='toolbar'
            icon={<Icon as={icon} fontSize='xl' strokeWidth={1} />}
        />
    );
}
