import { useSelector } from 'react-redux';
import { Box, Button, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ChatAltIcon, DownloadIcon, MailIcon } from '@heroicons/react/outline';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { MapContainer } from 'react-leaflet';
import L from 'leaflet';

import { DefaultBasemap } from '../../Layers/Basemaps';
import MapPanes from '../../MapPanes';

import {
    BOUNDARY_STATUS,
    MAP_CENTER,
    MAP_INITIAL_ZOOM,
    POLYGON_LAYER_OPTIONS,
    ROLES,
} from '../../../constants';
import { useMapLayer } from '../../../hooks';
import { downloadData, getBoundaryShapeFilename } from '../../../utils';

export default function Map({ boundary, startReview }) {
    return (
        <>
            <MapContainer
                center={MAP_CENTER}
                zoom={MAP_INITIAL_ZOOM}
                zoomControl={false}
                style={{ height: 'calc(100% - var(--chakra-sizes-12))' }}
            >
                <MapPanes>
                    <DefaultBasemap />
                    <MapButtons boundary={boundary} startReview={startReview} />
                    <Polygon shape={boundary.submission.shape} />
                </MapPanes>
            </MapContainer>
            <SubmissionStatusBar status={boundary.status} />
        </>
    );
}

function MapButtons({ boundary, startReview }) {
    const navigate = useNavigate();
    const userRole = useSelector(state => state.auth.user.role);

    const canEditDraft =
        userRole === ROLES.CONTRIBUTOR || userRole === ROLES.ADMINISTRATOR;
    const canReview =
        userRole === ROLES.VALIDATOR || userRole === ROLES.ADMINISTRATOR;

    const getDrawButtonText = () => {
        switch (boundary.status) {
            case BOUNDARY_STATUS.DRAFT:
                return canEditDraft ? 'Edit boundary' : null;
            case BOUNDARY_STATUS.SUBMITTED:
                return canReview ? 'Start review' : null;
            case BOUNDARY_STATUS.IN_REVIEW:
                return canReview ? 'Continue review' : null;
            default:
                return null;
        }
    };

    const goToDrawPage = () => navigate(`/draw/${boundary.id}`);

    const getDrawButtonOnClick = () => {
        switch (boundary.status) {
            case BOUNDARY_STATUS.DRAFT:
                return canEditDraft ? goToDrawPage : null;
            case BOUNDARY_STATUS.SUBMITTED:
                return canReview
                    ? () => startReview(boundary.id).unwrap().then(goToDrawPage)
                    : null;
            case BOUNDARY_STATUS.IN_REVIEW:
                return canReview ? goToDrawPage : null;

            default:
                return null;
        }
    };

    const drawButtonText = getDrawButtonText();
    const drawButtonOnClick = getDrawButtonOnClick();

    return (
        <Box position='absolute' zIndex={1000} top={22} w='100%'>
            <Flex justify='space-evenly'>
                {drawButtonText ? (
                    <MapButton icon={ChatAltIcon} onClick={drawButtonOnClick}>
                        {drawButtonText}
                    </MapButton>
                ) : null}
                <MapButton icon={MailIcon}>
                    <a
                        href={`mailto:${boundary.submission.primary_contact.email}`}
                        style={{ color: 'inherit' }}
                    >
                        Email
                    </a>
                </MapButton>
                <MapButton
                    icon={DownloadIcon}
                    onClick={() =>
                        downloadData(
                            JSON.stringify(boundary.submission.shape),
                            getBoundaryShapeFilename(boundary)
                        )
                    }
                >
                    Download
                </MapButton>
            </Flex>
        </Box>
    );
}

function MapButton({ icon, children, onClick }) {
    return (
        <Button
            size='lg'
            variant='mapButton'
            boxShadow='lg'
            rightIcon={<Icon as={icon} />}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}

function SubmissionStatusBar({ status }) {
    const getDetailText = () => {
        switch (status) {
            case BOUNDARY_STATUS.DRAFT:
                return 'This map is a draft.';
            case BOUNDARY_STATUS.SUBMITTED:
            case BOUNDARY_STATUS.IN_REVIEW:
                return 'This map will be reviewed.';
            case BOUNDARY_STATUS.NEEDS_REVISIONS:
                return 'This map needs revisions.';
            case BOUNDARY_STATUS.APPROVED:
                return 'This map has been approved.';
            default:
                throw new Error(`Unexpected status ${status}`);
        }
    };
    return (
        <Box h={12} bg='teal.50' w='100%' borderRadius={6}>
            <HStack p={3}>
                <Icon
                    as={ExclamationCircleIcon}
                    color='teal.400'
                    boxSize={6}
                ></Icon>
                <Text textStyle='detail'>{getDetailText()}</Text>
            </HStack>
        </Box>
    );
}

function Polygon({ shape }) {
    useMapLayer(L.geoJSON(shape, POLYGON_LAYER_OPTIONS), {
        fitBounds: true,
    });
}
