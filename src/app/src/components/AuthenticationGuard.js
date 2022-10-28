import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import apiClient from '../api/client';
import { API_URLS } from '../constants';
import { login } from '../store/authSlice';
import CenteredSpinner from './CenteredSpinner';

export default function AuthenticationGuard({ children }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        if (!authChecked) {
            apiClient
                .get(API_URLS.LOGIN)
                .then(({ data: user }) => {
                    dispatch(login(user));
                })
                .catch(() => {})
                .finally(() => {
                    setAuthChecked(true);
                });
        }
    }, [authChecked, dispatch]);

    if (!authChecked) {
        return <CenteredSpinner />;
    }

    if (!user) {
        return <Navigate to='/login' />;
    }

    return children;
}
