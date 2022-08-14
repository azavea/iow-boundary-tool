import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';

import apiClient from '../api/client';
import { API_URLS, API_STATUSES, APP_URLS } from '../constants';
import { login } from '../store/authSlice';
import LoginForm from '../components/LoginForm';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorDetail, setErrorDetail] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

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

    const locationBeforeAuth = location.state
        ? location.state.pathname + location.state.search
        : null;

    const destination = locationBeforeAuth ?? '/submissions';

    // Upon successful sign in, redirect if specified (e.g. by /login route)
    useEffect(() => {
        if (user) {
            navigate(destination, {
                replace: true,
                state: { pathname: '/login' },
            });
        }
    }, [dispatch, navigate, user, destination]);

    return (
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
                <Button variant='minimal' onClick={() => navigate('/forgot')}>
                    Forgot password?
                </Button>
            </VStack>
        </LoginForm>
    );
}
