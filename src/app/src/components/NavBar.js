import {
    Button,
    Flex,
    SimpleGrid,
    Heading,
    Icon,
    Spacer,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, LogoutIcon } from '@heroicons/react/outline';
import apiClient from '../api/client';
import { API_URLS, NAVBAR_HEIGHT } from '../constants';
import { logout } from '../store/authSlice';
import UtilityControl from './UtilityControl';
import { useBoundaryId } from '../hooks';

export const NAVBAR_VARIANTS = {
    DRAW: 'draw',
    SUBMISSION: 'submission',
};

export default function NavBar({ variant }) {
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
                <ExitButton variant={variant} />
            </Flex>
        </SimpleGrid>
    );
}

function ExitButton({ variant }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const boundaryId = useBoundaryId();

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
