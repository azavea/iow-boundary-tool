import { useState } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { API } from '../api';
import { API_URLS } from '../constants';
import LoginForm from '../components/LoginForm';
import { formatApiError } from '../utils';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorDetail, setErrorDetail] = useState('');
    const navigate = useNavigate();

    const forgotPasswordRequest = () => {
        API.post(API_URLS.FORGOT, { email })
            .then(() => {
                setSuccess(true);
                setErrorDetail('');
            })
            .catch(apiError => {
                setSuccess(false);
                setErrorDetail(formatApiError(apiError.response?.data));
            });
    };

    return (
        <LoginForm>
            {success ? (
                <>
                    <Text textStyle='forgotPasswordHeader'>
                        If an account exists for {email}, instructions for
                        resetting your password have been sent.
                    </Text>
                    <Button variant='cta' onClick={() => navigate('/login')}>
                        Login
                    </Button>
                </>
            ) : (
                <>
                    <Text fontFamily='heading' fontSize='lg'>
                        Forgot password?
                    </Text>
                    {errorDetail && (
                        <Text textStyle='apiError' align='center'>
                            {errorDetail}
                        </Text>
                    )}
                    <Box>
                        <Text fontFamily='body' fontSize='sm' align='center'>
                            You will receive password reset instructions by
                            email.
                        </Text>
                    </Box>
                    <Input
                        width='xs'
                        bg='white'
                        aria-label='email'
                        placeholder='email'
                        type='email'
                        isInvalid={!!errorDetail}
                        onChange={({ target: { value } }) => setEmail(value)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                forgotPasswordRequest(email);
                            }
                        }}
                    />
                    <Button
                        width='xs'
                        variant='cta'
                        onClick={() => forgotPasswordRequest(email)}
                    >
                        Continue
                    </Button>
                </>
            )}
        </LoginForm>
    );
}
