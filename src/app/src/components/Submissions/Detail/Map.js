import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Spacer,
    Text,
} from '@chakra-ui/react';
import {
    ChatAltIcon,
    DownloadIcon,
    MailIcon,
    InformationCircleIcon,
} from '@heroicons/react/outline';
import { MapContainer } from 'react-leaflet';

import { DefaultBasemap } from '../../Layers/Basemaps';
import MapPanes from '../../MapPanes';

import { MAP_CENTER, MAP_INITIAL_ZOOM } from '../../../constants';

export default function Map({ submission }) {
    return (
        <>
            <Flex mb={2}>
                <Spacer />
                <Button rightIcon={<Icon as={ChatAltIcon} />}>
                    Review map
                </Button>
                <Button ml={3} rightIcon={<Icon as={MailIcon} />}>
                    Email
                </Button>
                <Button ml={3} rightIcon={<Icon as={DownloadIcon} />}>
                    Download
                </Button>
            </Flex>
            <MapContainer
                center={MAP_CENTER}
                zoom={MAP_INITIAL_ZOOM}
                zoomControl={false}
                style={{ height: '486px' }}
            >
                <MapPanes>
                    <DefaultBasemap />
                </MapPanes>
            </MapContainer>
            <Box h={12} bg='#E6FFFA'>
                <HStack pl={3} pt={3}>
                    <Icon as={InformationCircleIcon}></Icon>
                    <Text textStyle='submissionDetailBody'>
                        Your map will be reviewed.
                    </Text>
                </HStack>
            </Box>
        </>
    );
}
