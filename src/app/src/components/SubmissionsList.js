import {
    HStack,
    Box,
    Heading,
    Icon,
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
import { heroToChakraIcon } from '../utils';
import { SubmittedBadge } from './SubmissionBadges';

const tableHeaders = (
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

export default function SubmissionsList() {
    const getSubmissions = ({ active = true }) => {
        return (
            <TableContainer borderRadius='2px'>
                <Table variant='submissions'>
                    {tableHeaders}
                    <Tbody>
                        <Tr>
                            <Td>
                                <Text textStyle='utilityEntry'>Raleigh</Text>
                                <Text textStyle='utilityId'>0111010</Text>
                            </Td>
                            <Td>
                                <Text textStyle='timestamp'>
                                    July 7, 2022 3:32 pm
                                </Text>
                            </Td>
                            <Td>
                                <SubmittedBadge />
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box paddingLeft={8} paddingRight={8} mt={6}>
            <Heading size='lg'>Submissions</Heading>
            <Tabs mt={3} isLazy>
                <TabList borderBottom='0' mb={6}>
                    <Tab>Active</Tab>
                    <Tab>Archived</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>{getSubmissions({})}</TabPanel>
                    {/* archived tab is lazily fetched */}
                    <TabPanel>{getSubmissions({ active: false })}</TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}
