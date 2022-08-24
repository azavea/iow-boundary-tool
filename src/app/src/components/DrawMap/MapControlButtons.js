import { Box, Icon, IconButton, VStack } from '@chakra-ui/react';

import { SearchIcon, PlusIcon, MinusIcon } from '@heroicons/react/outline';
import { useMap } from 'react-leaflet';

import { usePreventMapDoubleClick } from '../../hooks';

export default function MapControlButtons() {
    const map = useMap();

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
