import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalHeader,
    Heading,
    Text,
} from '@chakra-ui/react';
import { MapContainer, TileLayer } from 'react-leaflet';

export default function Welcome() {
    return (
        <>
            <Modal isOpen isCentered size={'5xl'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Heading size='lg'>Welcome to BoundarySync</Heading>
                    </ModalHeader>
                    <ModalBody>
                        <Text>
                            Build a digital map of your service area boundary in
                            minutes for free. No complex software or training
                            needed.
                        </Text>
                        <Button variant='link'>Learn more</Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
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
        </>
    );
}
