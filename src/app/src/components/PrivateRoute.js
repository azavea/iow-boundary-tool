import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { API } from '../api';
import { API_URLS } from '../constants';
import { login, setLocationBeforeAuth } from '../store/authSlice';

export default function PrivateRoute({ children }) {
    const signedIn = useSelector(state => state.auth.signedIn);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Log in this user if they have an authenticated session
    // Handles losing Redux state on refresh
    useEffect(() => {
        if (!signedIn) {
            dispatch(setLocationBeforeAuth(location));
            API.get(API_URLS.LOGIN)
                .then(() => {
                    dispatch(login());
                })
                .catch(() => {
                    if (!location.pathname.startsWith('/login')) {
                        navigate('/login');
                    }
                });
        }
    }, [signedIn, location, navigate, dispatch]);

    return children;
}
