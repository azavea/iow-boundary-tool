import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    IconButton,
    StackDivider,
    VStack,
} from '@chakra-ui/react';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBoundaryDetailsQuery } from '../../../api/boundaries';
import CenteredSpinner from '../../CenteredSpinner';
import { CheckCircleIcon } from '@heroicons/react/outline';

import ActivityLog from '../ActivityLog';
import { StatusBadge } from '../Badges';
import Info from './Info';
import Map from './Map';
import { useEndpointToastError } from '../../../hooks';
import { useStartReviewMutation } from '../../../api/reviews';
import { NAVBAR_HEIGHT, ROLES } from '../../../constants';
import { useSelector } from 'react-redux';
import { heroToChakraIcon } from '../../../utils';

export default function SubmissionDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const userRole = useSelector(state => state.auth.user.role);

    const {
        data: boundary,
        isFetching,
        error,
    } = useGetBoundaryDetailsQuery(id);

    useEndpointToastError(
        error,
        'There was an error fetching boundary details.'
    );

    if (isFetching) {
        return <CenteredSpinner />;
    }

    if (!boundary) {
        return null;
    }

    const showApproveButton =
        userRole === ROLES.VALIDATOR || userRole === ROLES.ADMINISTRATOR;

    return (
        <VStack
            p={10}
            bg='gray.50'
            align='stretch'
            divider={<StackDivider />}
            minH={`calc(100vh - ${NAVBAR_HEIGHT}px)`}
        >
            <Flex mb={7}>
                <Flex direction='column' w='50%'>
                    <Flex alignItems='center'>
                        <IconButton
                            icon={<Icon as={ArrowLeftIcon} />}
                            aria-label='Back'
                            mr={6}
                            onClick={() => navigate('/submissions')}
                        />
                        <Heading size='lg' mr={6}>
                            {boundary.name}
                        </Heading>
                        <StatusBadge status={boundary.status} fixedHeight />
                    </Flex>
                    <Info
                        primary_contact={boundary.submission.primary_contact}
                        utility={boundary.utility}
                    />
                </Flex>
                <Flex direction='column' w='50%'>
                    {showApproveButton ? (
                        <Button
                            mb={4}
                            alignSelf='flex-end'
                            rightIcon={heroToChakraIcon(CheckCircleIcon)()}
                        >
                            Mark approved
                        </Button>
                    ) : null}

                    <Box
                        h='sm'
                        border='2px solid'
                        borderColor='gray.200'
                        borderRadius={6}
                    >
                        <Map boundary={boundary} startReview={startReview} />
                    </Box>
                </Flex>
            </Flex>
            <Box>
                <ActivityLog entries={boundary.activity_log} />
            </Box>
        </VStack>
    );
}
