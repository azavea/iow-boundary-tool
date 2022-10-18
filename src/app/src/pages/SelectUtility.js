import { Button, Text } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import apiClient from '../api/client';
import LoginForm from '../components/LoginForm';
import UtilityControl from '../components/UtilityControl';
import { logout } from '../store/authSlice';

import { API_URLS } from '../constants';

export default function SelectUtility() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const locationBeforeAuth = useSelector(
        state => state.auth.locationBeforeAuth
    );
    const destination = locationBeforeAuth || '/welcome';
    const utilities = useSelector(state => state.auth.user?.utilities);
    const width = '320px';

    return utilities?.length ? (
        <LoginForm>
            <Text textStyle='loginHeader'>Boundary Sync</Text>
            <Text textStyle='utilitySelectLabel' w={width} pt={2} pl={2}>
                Select your utility
            </Text>
            <UtilityControl readOnly={false} width={width} />
            <Button
                variant='cta'
                width='xs'
                onClick={() => navigate(destination)}
            >
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
