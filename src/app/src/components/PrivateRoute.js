import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import apiClient from '../api/client';
import { API_URLS } from '../constants';
import { login, setLocationBeforeAuth } from '../store/authSlice';
import CenteredSpinner from './CenteredSpinner';

export default function PrivateRoute({ children }) {
    const user = useSelector(state => state.auth.user);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Log in this user if they have an authenticated session
    // Handles losing Redux state on refresh
    useEffect(() => {
        if (!user) {
            dispatch(setLocationBeforeAuth(location));
            apiClient
                .get(API_URLS.LOGIN)
                .then(({ data: user }) => {
                    dispatch(login(user));
                })
                .catch(() => {
                    navigate('/login');
                });
        }
    }, [user, location, navigate, dispatch]);

    if (!user) {
        return <CenteredSpinner />;
    }

    return children;
}
