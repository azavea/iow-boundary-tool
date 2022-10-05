import { Box, Button, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { ChatAltIcon, DownloadIcon, MailIcon } from '@heroicons/react/outline';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { MapContainer } from 'react-leaflet';

import { DefaultBasemap } from '../../Layers/Basemaps';
import MapPanes from '../../MapPanes';

import { MAP_CENTER, MAP_INITIAL_ZOOM } from '../../../constants';

export default function Map({ submission }) {
    return (
        <>
            <MapContainer
                center={MAP_CENTER}
                zoom={MAP_INITIAL_ZOOM}
                zoomControl={false}
                style={{ height: '100%' }}
            >
                <MapPanes>
                    <DefaultBasemap />
                    <MapButtons submission={submission} />
                    <SubmissionStatusBar submission={submission} />
                </MapPanes>
            </MapContainer>
        </>
    );
}

function MapButtons({ submission }) {
    return (
        <Box position='absolute' zIndex={1000} top={22} w='100%'>
            <Flex justify='space-evenly'>
                <MapButton icon={ChatAltIcon}>Review map</MapButton>
                <MapButton icon={MailIcon}>Email</MapButton>
                <MapButton icon={DownloadIcon}>Download</MapButton>
            </Flex>
        </Box>
    );
}

function MapButton({ icon, children }) {
    return (
        <Button
            size='lg'
            variant='mapButton'
            boxShadow='lg'
            rightIcon={<Icon as={icon} />}
        >
            {children}
        </Button>
    );
}

function SubmissionStatusBar({ submission }) {
    return (
        <Box
            h={12}
            bg='teal.50'
            position='absolute'
            zIndex={1000}
            bottom={0}
            w='100%'
            borderRadius={6}
        >
            <HStack p={3}>
                <Icon
                    as={InformationCircleIcon}
                    color='teal.400'
                    boxSize={6}
                ></Icon>
                <Text textStyle='submissionDetailBody'>
                    Your map will be reviewed.
                </Text>
            </HStack>
        </Box>
    );
}
