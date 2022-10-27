import { Box, Flex } from '@chakra-ui/react';
import DrawContextProvider from '../components/DrawContext';

import DrawTools from '../components/DrawTools';
import Layers from '../components/Layers';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';

export default function Draw() {
    return (
        <Flex>
            <Sidebar />
            <Box flex={1} position='relative'>
                <Map>
                    <DrawContextProvider>
                        <Layers />
                        <DrawTools />
                    </DrawContextProvider>
                </Map>
            </Box>
        </Flex>
    );
}
