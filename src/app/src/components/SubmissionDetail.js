import {
    Box,
    Checkbox,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Text,
} from '@chakra-ui/react';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { useNavigate, useParams } from 'react-router-dom';

import ActivityLog from './ActivityLog';
import { SubmittedBadge } from './SubmissionBadges';

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

    const {
        submissionName,
        contactName,
        contactPhone,
        contactTitle,
        pwsId,
        utilityName,
        utilityAddress1,
        utilityAddress2,
        utilityCity,
        utilityState,
        utilityZip,
        sharingPreference,
    } = fetchSubmissionDetails(submissionId);

    const cityStateZip = `${utilityCity}, ${utilityState} ${utilityZip}`;

    const makeDataGrid = ({ initialMarginTop, title, data }) => {
        return (
            <>
                <Text
                    mt={initialMarginTop}
                    textStyle='submissionDetailCategory'
                >
                    {title}
                </Text>
                <Grid templateColumns='repeat(2, 1fr)' gap={2}>
                    {Object.entries(data).map(([label, entry]) => {
                        return (
                            <GridItem key={label}>
                                <Text
                                    mt={4}
                                    textStyle='submissionDetailHeading'
                                >
                                    {label}
                                </Text>
                                {/* if not a string, accept a React element */}
                                {entry instanceof String ? (
                                    <Text
                                        mt={1}
                                        textStyle='submissionDetailBody'
                                    >
                                        {entry}
                                    </Text>
                                ) : (
                                    entry
                                )}
                            </GridItem>
                        );
                    })}
                </Grid>
            </>
        );
    };

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
                {makeDataGrid({
                    initialMarginTop: 7,
                    title: 'Primary contact',
                    data: {
                        'Full name': contactName,
                        'Phone number': contactPhone,
                        'Job title': contactTitle,
                    },
                })}
                {makeDataGrid({
                    initialMarginTop: 10,
                    title: 'Water system information',
                    data: {
                        PWSID: pwsId,
                        'Water system name': utilityName,
                        'Mailing address': (
                            <>
                                <Text mt={1} textStyle='submissionDetailBody'>
                                    {utilityAddress1}
                                </Text>
                                <Text mt={1} textStyle='submissionDetailBody'>
                                    {utilityAddress2}
                                </Text>
                                <Text mt={1} textStyle='submissionDetailBody'>
                                    {cityStateZip}
                                </Text>
                            </>
                        ),
                    },
                })}
                <Box>
                    <Checkbox isChecked={sharingPreference} mt={6} mb={12}>
                        I would like to share data with surrounding towns
                    </Checkbox>
                </Box>
                <Divider />
                <ActivityLog submissionId={submissionId} />
            </Box>
        </Flex>
    );
}
