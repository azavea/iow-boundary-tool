import { Box, Container, Flex, Text } from '@chakra-ui/react';
import { MapContainer, TileLayer } from 'react-leaflet';

export default function Main() {
    return (
        <Flex>
            <Container maxW='xs' bg='gray.700'>
                <Text>Sidebar</Text>
            </Container>
            <Box flex={1}>
                <MapContainer
                    center={[35.1497496, -82.1090076, 7]}
                    zoom={13}
                    zoomControl={false}
                    style={{ height: '100vh' }}
                >
                    <TileLayer
                        attribution='Powered by <a href="https://www.esri.com/">ESRI</a>'
                        url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png'
                    />
                </MapContainer>
            </Box>
        </Flex>
    );
}
