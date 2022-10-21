import { Button, Text } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import apiClient from '../api/client';
import LoginForm from '../components/LoginForm';
import UtilityControl from '../components/UtilityControl';
import { logout } from '../store/authSlice';

import {
    BASE_API_URL,
    API_URLS,
    BOUNDARY_STATUS,
    UTILITY_CONTROL_WIDTH,
} from '../constants';

export default function SelectUtility() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const locationBeforeAuth = useSelector(
        state => state.auth.locationBeforeAuth
    );
    const destination = locationBeforeAuth || '/welcome';
    const utilities = useSelector(state => state.auth.user?.utilities);
    const utility = useSelector(state => state.auth.utility);
    const width = `${UTILITY_CONTROL_WIDTH}px`;

    const navigateAway = () => {
        apiClient
            .get(`${BASE_API_URL}/boundaries/?utilities=${utility.id}`)
            .then(({ data: boundaries }) => {
                const drafts = boundaries.filter(
                    b => b.status === BOUNDARY_STATUS.DRAFT
                );
                if (drafts.length > 0) {
                    navigate(`/draw/${drafts[0].id}`);
                } else {
                    navigate(destination);
                }
            })
            .catch(navigate(destination));
    };

    return utilities?.length ? (
        <LoginForm>
            <Text textStyle='loginHeader'>Boundary Sync</Text>
            <Text textStyle='utilitySelectLabel' w={width} pt={2} pl={2}>
                Select your utility
            </Text>
            <UtilityControl readOnly={false} width={width} />
            <Button variant='cta' width='xs' onClick={navigateAway}>
                Proceed
            </Button>
        </LoginForm>
    ) : (
        <LoginForm>
            <Text textStyle='loginHeader'>Boundary Sync</Text>
            <Text
                textStyle='apiError'
                textAlign='center'
                w={width}
                pt={2}
                pl={2}
            >
                You will need to be assigned a utility to proceed.
            </Text>
            <Button
                variant='cta'
                width='xs'
                onClick={() => {
                    apiClient.post(API_URLS.LOGOUT, {}).then(() => {
                        dispatch(logout());
                        navigate('/login');
                    });
                }}
            >
                Logout
            </Button>
        </LoginForm>
    );
}
