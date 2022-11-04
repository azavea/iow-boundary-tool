import { useEffect } from 'react';
import {
    HStack,
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    Spacer,
    Spinner,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
} from '@chakra-ui/react';
import {
    ClockIcon,
    FlagIcon,
    LocationMarkerIcon,
} from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { heroToChakraIcon } from '../../utils';
import { useGetBoundariesQuery } from '../../api/boundaries';

import { StatusBadge } from './Badges';
import { ROLES } from '../../constants';

export default function SubmissionsList() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector(state => state.auth.user);
    const utilityId = useSelector(state => state.auth.utility?.id);

    const {
        isFetching,
        data: boundaries,
        error,
    } = useGetBoundariesQuery({
        utilities: user.role === ROLES.CONTRIBUTOR ? utilityId : undefined,
    });

    // Navigate to /welcome if coming from /login and no boundaries already
    useEffect(() => {
        if (boundaries?.length === 0 && location.state?.pathname === '/login') {
            navigate('/welcome');
        }
    }, [location.state, boundaries, navigate]);

    return (
        <Box paddingLeft={8} paddingRight={8} mt={6}>
            <Flex>
                <Heading size='lg'>Submissions</Heading>
                <Spacer />
                <Button
                    mr={4}
                    disabled={boundaries?.length > 0}
                    onClick={() => navigate('/welcome')}
                >
                    Add map
                </Button>
            </Flex>
            <Tabs mt={3} isLazy>
                <TabList borderBottom='0' mb={6}>
                    <Tab>Active</Tab>
                    <Tab isDisabled>Archived</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <TableContainer borderRadius='2px'>
                            <Table variant='submissions'>
                                <TableHeader />
                                <Tbody>
                                    <TableRows
                                        isFetching={isFetching}
                                        error={error}
                                        boundaries={boundaries}
                                    />
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    {/* TODO Implement Archived Tab */}
                    <TabPanel></TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}

function TableHeader() {
    return (
        <Thead>
            <Tr>
                <Th>
                    <HStack>
                        <Icon as={heroToChakraIcon(LocationMarkerIcon)} />
                        <Text textStyle='tableHeading'>Location / PWSID</Text>
                    </HStack>
                </Th>
                <Th>
                    <HStack>
                        <Icon as={heroToChakraIcon(ClockIcon)} />
                        <Text textStyle='tableHeading'>Last modified</Text>
                    </HStack>
                </Th>
                <Th>
                    <HStack>
                        <Icon as={heroToChakraIcon(FlagIcon)} />
                        <Text textStyle='tableHeading'>Status</Text>
                    </HStack>
                </Th>
            </Tr>
        </Thead>
    );
}

function TableRows({ isFetching, error, boundaries }) {
    if (isFetching) {
        return <LoadingRow />;
    }

    if (error) {
        return <ErrorRow />;
    }

    if (boundaries) {
        return boundaries.map(b => <TableRow key={b.id} boundary={b} />);
    }
}

function TableRow({
    boundary: { id, location, pwsid, last_modified, status },
}) {
    const navigate = useNavigate();

    return (
        <Tr
            cursor='pointer'
            _hover={{ background: 'gray.50' }}
            onClick={() => navigate(`/submissions/${id}`)}
        >
            <Td>
                <Text textStyle='utilityEntry'>{location}</Text>
                <Text textStyle='utilityId'>{pwsid}</Text>
            </Td>
            <Td>
                <Text textStyle='timestamp'>
                    {new Date(last_modified).toDateString()}
                </Text>
            </Td>
            <Td>
                <StatusBadge status={status} />
            </Td>
        </Tr>
    );
}

function LoadingRow() {
    return (
        <Tr>
            <Td />
            <Td>
                <Spinner />
            </Td>
            <Td />
        </Tr>
    );
}

function ErrorRow({ error }) {
    return (
        <Tr>
            <Td />
            <Td>There was an error fetching data. Details: {error}</Td>
            <Td />
        </Tr>
    );
}
