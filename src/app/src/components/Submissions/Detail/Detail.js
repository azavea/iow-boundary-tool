import {
    Box,
    Checkbox,
    Divider,
    Flex,
    Heading,
    Icon,
    IconButton,
} from '@chakra-ui/react';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { useNavigate, useParams } from 'react-router-dom';

import ActivityLog from '../ActivityLog';
import { SubmittedBadge } from '../Badges';
import Info from './Info';
import Map from './Map';

export default function SubmissionDetail() {
    const navigate = useNavigate();
    const params = useParams();

    const submissionId = params.id;

    const fetchSubmissionDetails = submissionId => {
        return {
            submissionName: 'Raleigh',
            contactName: 'Jenny Smith',
            contactPhone: '1-919-123-4567',
            contactTitle: 'Water System Operator',
            pwsId: '0392010',
            utilityName: 'Raleigh City Of',
            utilityAddress1: 'Division of Water Resources',
            utilityAddress2: '1634 Mail Service Center',
            utilityCity: 'Raleigh',
            utilityState: 'NC',
            utilityZip: '27699-1634',
            sharingPreference: true,
            status: 'submitted',
        };
    };

    const submission = fetchSubmissionDetails(submissionId);

    const { submissionName, sharingPreference } = submission;

    return (
        <Flex h='100vh' paddingTop={10} paddingBottom={10} bg='gray.50'>
            <Box ml={8} mr={8} w={650}>
                <Flex>
                    <IconButton
                        icon={<Icon as={ArrowLeftIcon} />}
                        aria-label='Back'
                        mr={6}
                        onClick={() => navigate('/submissions')}
                    />
                    <Heading size='lg' mr={6}>
                        {submissionName}
                    </Heading>
                    <SubmittedBadge variant='submissionDetail' />
                </Flex>
                <Info submission={submission} />
                <Box>
                    <Checkbox isChecked={sharingPreference} mt={6} mb={12}>
                        I would like to share data with surrounding towns
                    </Checkbox>
                </Box>
                <Divider />
                <ActivityLog submissionId={submissionId} />
            </Box>
            <Box w={650}>
                <Map submission={submission} />
            </Box>
        </Flex>
    );
}
