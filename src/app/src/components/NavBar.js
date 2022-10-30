import {
    Button,
    Flex,
    SimpleGrid,
    Heading,
    Icon,
    IconButton,
    Spacer,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CogIcon, LogoutIcon } from '@heroicons/react/outline';
import apiClient from '../api/client';
import { API_URLS, NAVBAR_HEIGHT } from '../constants';
import { logout } from '../store/authSlice';
import UtilityControl from './UtilityControl';
import { getBoundaryPermissions } from '../utils';

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
                <UtilityControl readOnly={variant === NAVBAR_VARIANTS.DRAW} />
            </Flex>

            <Flex align='center' justify='center'>
                <Heading size='md' color='white'>
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
    const { '*': params } = useParams();

    const boundaryId = params.startsWith('draw/') ? params.substring(5) : '';

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
            onClick={() => navigate(`/submissions/${boundaryId}`)}
            rightIcon={<Icon as={ArrowLeftIcon} />}
        >
            Back
        </Button>
    );
}
