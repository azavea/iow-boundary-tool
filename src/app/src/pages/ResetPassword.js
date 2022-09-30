import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Input, Text } from '@chakra-ui/react';

import { API } from '../api';
import { API_URLS } from '../constants';
import LoginForm from '../components/LoginForm';

export default function ResetPassword() {
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorDetail, setErrorDetail] = useState('');
    const [invalidToken, setInvalidToken] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const uid = location.pathname.split('/')[3];
    const token = location.pathname.split('/')[4];

    const formatApiError = apiErrorData => {
        var errorDetail = 'An unknown error occurred.';
        var passwordErrorSeen = false;

        for (const [field, errorArray] of Object.entries(apiErrorData)) {
            if (['uid', 'token'].includes(field)) {
                errorDetail = 'The link you followed is no longer valid.';
            } else if (!passwordErrorSeen) {
                // Avoid duplicating password error messages
                var formattedField;
                if (field.includes('password')) {
                    // new_password_1 -> Password
                    formattedField = 'Password';
                    passwordErrorSeen = true;
                } else {
                    formattedField = `${field[0].toUpperCase()}${field.slice(
                        1
                    )}`;
                }
                errorDetail = `${formattedField}: ${errorArray.join(' ')}`;
            }
        }
        return errorDetail;
    };

    const forgotPasswordRequest = () => {
        API.post(API_URLS.CONFIRM, {
            uid,
            token,
            new_password1: newPassword1,
            new_password2: newPassword2,
        })
            .then(() => {
                setSuccess(true);
                setErrorDetail('');
            })
            .catch(apiError => {
                setSuccess(false);
                setErrorDetail(formatApiError(apiError.response?.data));
            });
    };

    // Find out if the uid and token are valid on first render.
    // This will require sending a dummy password that will never be valid (too short)
    // in order to get a response including the token or uid fields.
    useEffect(() => {
        API.post(API_URLS.CONFIRM, {
            uid,
            token,
            new_password1: '!', // too short
            new_password2: '@',
        }).catch(apiError => {
            const errorFields = Object.keys(apiError.response?.data);
            if (errorFields.includes('token') || errorFields.includes('uid')) {
                setInvalidToken(true);
                setSuccess(false);
            }
        });
    }, [uid, token]);

    if ((!uid || !token || invalidToken) && !errorDetail) {
        setErrorDetail('The link you followed is no longer valid.');
        setDisableSubmit(true);
    }

    function makePasswordInput(setter, placeholder) {
        return (
            <Input
                htmlSize={32}
                width='auto'
                bg='white'
                aria-label={placeholder}
                placeholder={placeholder}
                type='password'
                isInvalid={!!errorDetail && !disableSubmit}
                disabled={disableSubmit}
                onChange={({ target: { value } }) => setter(value)}
                onKeyPress={e => {
                    if (e.key === 'Enter') {
                        forgotPasswordRequest(
                            uid,
                            token,
                            newPassword1,
                            newPassword2
                        );
                    }
                }}
            />
        );
    }

    let resultOrInstruction;
    if (success) {
        resultOrInstruction = 'Your password has been reset';
    } else {
        if (disableSubmit || invalidToken) {
            resultOrInstruction = '';
        } else {
            resultOrInstruction = 'Choose a new password (8+ characters)';
        }
    }

    return (
        <LoginForm>
            <Text fontFamily='heading' fontSize='lg'>
                Reset Password
            </Text>
            <Box>
                {errorDetail && (
                    <Text textStyle='apiError' align='center'>
                        {errorDetail}
                    </Text>
                )}
                <Text fontFamily='body' fontSize='md' align='center'>
                    {resultOrInstruction}
                </Text>
            </Box>
            {success || invalidToken ? (
                <Button variant='cta' onClick={() => navigate('/login')}>
                    Login
                </Button>
            ) : (
                <>
                    {makePasswordInput(setNewPassword1, 'new password')}
                    {makePasswordInput(setNewPassword2, 'new password (again)')}
                    <Button
                        w='320px'
                        variant='cta'
                        disabled={disableSubmit}
                        onClick={() =>
                            forgotPasswordRequest(
                                uid,
                                token,
                                newPassword1,
                                newPassword2
                            )
                        }
                    >
                        Continue
                    </Button>
                </>
            )}
        </LoginForm>
    );
}
