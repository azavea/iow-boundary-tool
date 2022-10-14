import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Flex, Spinner } from '@chakra-ui/react';

import NotFound from './NotFound';
import DrawTools from '../components/DrawTools';
import Layers from '../components/Layers';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';

import { useGetBoundaryDetailsQuery } from '../api/boundaries';
import { BOUNDARY_STATUS, ROLES } from '../constants';

const DRAW_MODES = {
    FULLY_EDITABLE: 'fully_editable',
    ANNOTATIONS_ONLY: 'annotations_only',
    READ_ONLY: 'read_only',
};

export default function Draw() {
    const user = useSelector(state => state.auth.user);
    const { id } = useParams();

    const { isFetching, data: details, error } = useGetBoundaryDetailsQuery(id);

    if (isFetching) {
        return (
            <Box w='100%' h='100vh'>
                <Flex direction='column' alignItems='center'>
                    <Spinner mt={60} />
                </Flex>
            </Box>
        );
    }

    if (error || typeof details !== 'object') {
        return <NotFound />;
    }

    let mode = DRAW_MODES.READ_ONLY;

    if (
        [BOUNDARY_STATUS.SUBMITTED, BOUNDARY_STATUS.IN_REVIEW].includes(
            details.status
        ) &&
        user.role === ROLES.VALIDATOR
    ) {
        mode = DRAW_MODES.ANNOTATIONS_ONLY;
    } else if (
        details.status === BOUNDARY_STATUS.DRAFT &&
        user.role === ROLES.CONTRIBUTOR
    ) {
        mode = DRAW_MODES.FULLY_EDITABLE;
    }

    return (
        <Flex>
            <Sidebar />
            <Box flex={1} position='relative'>
                <Map>
                    <Layers mode={mode} />
                    <DrawTools mode={mode} details={details} />
                </Map>
            </Box>
        </Flex>
    );
}
