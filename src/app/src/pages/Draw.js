import { Box, Container, Flex } from '@chakra-ui/react';

import DrawMap from '../components/DrawMap';
import Sidebar from '../components/Sidebar';

export default function Main() {
    return (
        <Flex>
            <Container maxW='xs' bg='gray.700' p={0}>
                <Sidebar />
            </Container>
            <Box flex={1} position='relative'>
                <DrawMap />
            </Box>
        </Flex>
    );
}
