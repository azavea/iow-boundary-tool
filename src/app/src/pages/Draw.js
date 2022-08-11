import { Box, Container, Flex } from '@chakra-ui/react';

import Map from '../components/Map';
import Sidebar from '../components/Sidebar';

export default function Main() {
    return (
        <Flex>
            <Container maxW='xs' bg='gray.700'>
                <Sidebar />
            </Container>
            <Box flex={1}>
                <Map />
            </Box>
        </Flex>
    );
}
