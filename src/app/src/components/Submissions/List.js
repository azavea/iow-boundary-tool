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
import { useNavigate } from 'react-router-dom';

import { heroToChakraIcon } from '../../utils';
import { useGetBoundariesQuery } from '../../api/boundaries';

import { StatusBadge } from './Badges';

export default function SubmissionsList() {
    const navigate = useNavigate();

    return (
        <Box paddingLeft={8} paddingRight={8} mt={6}>
            <Flex>
                <Heading size='lg'>Submissions</Heading>
                <Spacer />
                <Button mr={4} onClick={() => navigate('/draw')}>
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
                                    <TableRows />
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

function TableRows() {
    const { isFetching, data: boundaries, error } = useGetBoundariesQuery();

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
