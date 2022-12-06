import { Container, Divider, Flex } from '@chakra-ui/react';

import BasemapLayers from './BasemapLayers';
import ReferenceLayers from './ReferenceLayers';

import { paddingLeft } from './style';

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
