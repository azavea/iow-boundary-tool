import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';

import { API } from '../api';
import { API_URLS } from '../constants';
import { login } from '../store/authSlice';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorDetail, setErrorDetail] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginRequest = () => {
        API.post(API_URLS.LOGIN, {
            email,
            password,
        })
            .then(() => {
                dispatch(login());
            })
            .catch(apiError => {
                setErrorDetail(apiError.response?.data?.detail);
            });
    };

    const signedIn = useSelector(state => state.auth.signedIn);
    const locationBeforeAuth = useSelector(
        state => state.auth.locationBeforeAuth
    );

    // Upon successful sign in, redirect if specified (e.g. by /login route)
    useEffect(() => {
        if (signedIn) {
            navigate(locationBeforeAuth, { replace: true });
        }
    }, [navigate, signedIn, locationBeforeAuth]);

    return (
        <VStack bg='gray.50' h='100vh' spacing={5}>
            <Box h='20%'></Box>
            <Text textStyle='loginHeader'>Boundary Sync</Text>
            <Box>
                <Text textStyle='loginError'>{errorDetail}</Text>
            </Box>
            <Input
                htmlSize={32}
                width='auto'
                bg='white'
                placeholder='email'
                onChange={({ target: { value } }) => setEmail(value)}
                onKeyPress={e => {
                    if (e.key === 'Enter') {
                        loginRequest(email, password);
                    }
                }}
            />
            <Input
                htmlSize={32}
                width='auto'
                bg='white'
                type='password'
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
                    w='320px'
                    variant='cta'
                    onClick={() => loginRequest(email, password)}
                >
                    Login
                </Button>
                <Button variant='minimal'>Forgot password?</Button>
            </VStack>
        </VStack>
    );
}
