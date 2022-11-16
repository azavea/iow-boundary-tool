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
import { useNavigate } from 'react-router-dom';
import {
    useApproveBoundaryMutation,
    useGetBoundaryDetailsQuery,
    useUnapproveBoundaryMutation,
} from '../../../api/boundaries';
import CenteredSpinner from '../../CenteredSpinner';
import { CheckCircleIcon } from '@heroicons/react/outline';

import ActivityLog from '../ActivityLog';
import { StatusBadge } from '../Badges';
import Info from './Info';
import Map from './Map';
import { useBoundaryId, useEndpointToastError } from '../../../hooks';
import { useStartReviewMutation } from '../../../api/reviews';
import { useCreateDraftMutation } from '../../../api/boundaries';
import { NAVBAR_HEIGHT } from '../../../constants';
import { useSelector } from 'react-redux';
import { getBoundaryPermissions, heroToChakraIcon } from '../../../utils';

export default function SubmissionDetail() {
    const navigate = useNavigate();
    const id = useBoundaryId();
    const user = useSelector(state => state.auth.user);

    const {
        data: boundary,
        isFetching,
        error,
    } = useGetBoundaryDetailsQuery(id);

    useEndpointToastError(
        error,
        'There was an error fetching boundary details.'
    );

    const [
        startReview,
        { isLoading: isStartingReview, error: startReviewError },
    ] = useStartReviewMutation();

    const [
        createDraft,
        { isLoading: isCreatingDraft, error: createDraftMutationError },
    ] = useCreateDraftMutation();

    const [
        approveBoundary,
        { isLoading: isApprovingBoundary, error: approveBoundaryError },
    ] = useApproveBoundaryMutation();

    const [
        unapproveBoundary,
        { isLoading: isUnpprovingBoundary, error: unapproveBoundaryError },
    ] = useUnapproveBoundaryMutation();

    useEndpointToastError(
        startReviewError,
        'There was an error starting a review.'
    );

    useEndpointToastError(
        createDraftMutationError,
        'There was an error creating a new submission.'
    );

    useEndpointToastError(
        approveBoundaryError,
        'There was an error approving the submission.'
    );

    useEndpointToastError(
        unapproveBoundaryError,
        'There was an error unapproving the submission'
    );

    if (
        isFetching ||
        isStartingReview ||
        isCreatingDraft ||
        isApprovingBoundary ||
        isUnpprovingBoundary
    ) {
        return <CenteredSpinner />;
    }

    if (!boundary) {
        return null;
    }

    const { canApprove, canUnapprove } = getBoundaryPermissions({
        boundary,
        user,
    });

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
                            {boundary.utility.name}
                        </Heading>
                        <StatusBadge status={boundary.status} fixedHeight />
                    </Flex>
                    <Info
                        primary_contact={boundary.submission.primary_contact}
                        utility={boundary.utility}
                    />
                </Flex>
                <Flex direction='column' w='50%'>
                    {canApprove && (
                        <Button
                            mb={4}
                            alignSelf='flex-end'
                            rightIcon={heroToChakraIcon(CheckCircleIcon)()}
                            onClick={() => approveBoundary(boundary.id)}
                        >
                            Mark approved
                        </Button>
                    )}
                    {canUnapprove && (
                        <Button
                            mb={4}
                            alignSelf='flex-end'
                            rightIcon={heroToChakraIcon(CheckCircleIcon)()}
                            onClick={() => unapproveBoundary(boundary.id)}
                        >
                            Mark unapproved
                        </Button>
                    )}

                    <Box
                        h='sm'
                        border='2px solid'
                        borderColor='gray.200'
                        borderRadius={6}
                    >
                        <Map
                            boundary={boundary}
                            startReview={startReview}
                            createDraft={createDraft}
                        />
                    </Box>
                </Flex>
            </Flex>
            <Box>
                <ActivityLog entries={boundary.activity_log} />
            </Box>
        </VStack>
    );
}
