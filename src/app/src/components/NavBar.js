import {
    Button,
    Flex,
    SimpleGrid,
    Heading,
    Icon,
    IconButton,
    Select,
    Spacer,
    Text,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CogIcon, LogoutIcon } from '@heroicons/react/outline';
import apiClient from '../api/client';
import { API_URLS, NAVBAR_HEIGHT } from '../constants';
import { logout, setSelectedUtility } from '../store/authSlice';

const NAVBAR_VARIANTS = {
    DRAW: 'draw',
    SUBMISSION: 'submission',
};

export default function NavBar() {
    const location = useLocation();

    let variant = NAVBAR_VARIANTS.SUBMISSION;
    if (location.pathname.startsWith('/draw')) {
        variant = NAVBAR_VARIANTS.DRAW;
    }

    return (
        <SimpleGrid
            columns={3}
            paddingLeft={10}
            paddingRight={10}
            w='100%'
            h={NAVBAR_HEIGHT}
            bg='gray.700'
        >
            <Flex align='center'>
                <UtilityControl variant={variant} />
            </Flex>

            <Flex align='center' justify='center'>
                <Heading size='md' color='white' ml={6}>
                    Boundary Sync
                </Heading>
            </Flex>

            <Flex align='center' gap={4}>
                <Spacer />
                <SettingsButton variant={variant} />
                <ExitButton variant={variant} />
            </Flex>
        </SimpleGrid>
    );
}

function SettingsButton({ variant }) {
    const navigate = useNavigate();

    return variant === NAVBAR_VARIANTS.SUBMISSION ? (
        <IconButton
            icon={<Icon as={CogIcon} />}
            aria-label='Settings'
            onClick={() => {
                navigate('/settings');
            }}
        />
    ) : null;
}

function ExitButton({ variant }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return variant === NAVBAR_VARIANTS.SUBMISSION ? (
        <Button
            onClick={() => {
                apiClient.post(API_URLS.LOGOUT, {}).then(() => {
                    dispatch(logout());
                    navigate('/login');
                });
            }}
            rightIcon={<Icon as={LogoutIcon} />}
        >
            Log out
        </Button>
    ) : (
        <Button
            onClick={() => {
                navigate('/submissions');
            }}
            rightIcon={<Icon as={ArrowLeftIcon} />}
        >
            Save and back
        </Button>
    );
}

function UtilityControl({ variant }) {
    const dispatch = useDispatch();

    // placeholders
    const utilities = ['Raleigh City of', 'Azavea Test Utility'];
    const selectedUtility =
        useSelector(state => state.auth.selectedUtility) || utilities[0];

    return variant === NAVBAR_VARIANTS.SUBMISSION && utilities.length > 1 ? (
        <Select
            variant='filled'
            h='40px'
            w='250px'
            value={selectedUtility}
            onChange={e => {
                dispatch(setSelectedUtility(e.target.value));
            }}
            _focus={{ background: 'white' }}
        >
            {utilities.map(u => {
                return (
                    <option key={u} value={u}>
                        {u}
                    </option>
                );
            })}
        </Select>
    ) : (
        <Text textStyle='selectedUtility'>{selectedUtility}</Text>
    );
}
