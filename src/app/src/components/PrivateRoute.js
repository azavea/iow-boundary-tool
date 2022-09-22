import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { API } from '../api';
import { API_URLS } from '../constants';
import Login from '../pages/Login.js';
import { login } from '../store/authSlice';

export default function PrivateRoute({ children }) {
    const signedIn = useSelector(state => state.auth.signedIn);
    const location = useLocation();

    // Log in this user if they have an authenticated session
    // Handles losing Redux state on refresh
    useEffect(() => {
        if (!signedIn) {
            API.get(API_URLS.LOGIN)
                .then(() => {
                    dispatch(login());
                })
                .catch(() => {});
        }
    }, [signedIn, navigate, dispatch]);

    return children;
}
