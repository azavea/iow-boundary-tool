import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';

import apiClient from '../api/client';
import { API_URLS, API_STATUSES, APP_URLS, ROLES } from '../constants';
import { login, setUtilityByPwsid } from '../store/authSlice';
import LoginForm from '../components/LoginForm';
import SelectUtility from './SelectUtility';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorDetail, setErrorDetail] = useState('');
    const [forgotPassword, setForgotPassword] = useState(false);
    const [showUtilityControl, setShowUtilityControl] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginRequest = () => {
        apiClient
            .post(API_URLS.LOGIN, {
                email,
                password,
            })
            .then(({ data: user }) => {
                dispatch(login(user));
            })
            .catch(apiError => {
                if (apiError.response?.status === API_STATUSES.REDIRECT) {
                    const dest = `/${APP_URLS.RESET}${apiError.response.data.uid}/${apiError.response.data.token}/`;
                    navigate(dest);
                }
                setErrorDetail(apiError.response?.data?.detail);
            });
    };

    const user = useSelector(state => state.auth.user);
    const locationBeforeAuth = useSelector(
        state => state.auth.locationBeforeAuth
    );

    // Upon successful sign in, redirect if specified (e.g. by /login route)
    useEffect(() => {
        if (user) {
            if (user.utilities.length > 1 && user.role === ROLES.CONTRIBUTOR) {
                setShowUtilityControl(true);
                // Go ahead and set this, they'll have an opportunity to change it.
                dispatch(setUtilityByPwsid(user.utilities[0].pwsid));
            } else {
                navigate(locationBeforeAuth, { replace: true });
            }
        } else {
            setShowUtilityControl(false);
        }
        if (forgotPassword) {
            navigate('/forgot');
        }
    }, [dispatch, navigate, user, forgotPassword, locationBeforeAuth]);

    const loginForm = (
        <LoginForm>
            <Text textStyle='loginHeader'>Boundary Sync</Text>
            <Box>
                <Text textStyle='apiError'>{errorDetail}</Text>
            </Box>
            <Input
                width='xs'
                bg='white'
                aria-label='email'
                placeholder='email'
                onChange={({ target: { value } }) => setEmail(value)}
                onKeyPress={e => {
                    if (e.key === 'Enter') {
                        loginRequest(email, password);
                    }
                }}
            />
            <Input
                width='xs'
                bg='white'
                type='password'
                aria-label='password'
                placeholder='password'
                onChange={({ target: { value } }) => setPassword(value)}
                onKeyPress={e => {
                    if (e.key === 'Enter') {
                        loginRequest(email, password);
                    }
                }}
            />
            <VStack spacing={2}>
                <Button
                    width='xs'
                    variant='cta'
                    onClick={() => loginRequest(email, password)}
                >
                    Login
                </Button>
                <Button
                    variant='minimal'
                    onClick={() => setForgotPassword(true)}
                >
                    Forgot password?
                </Button>
            </VStack>
        </LoginForm>
    );

    return showUtilityControl ? <SelectUtility /> : loginForm;
}
