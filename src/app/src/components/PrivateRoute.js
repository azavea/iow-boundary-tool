import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

// Inspired by
// https://jasonwatmore.com/post/2022/06/24/react-router-6-private-route-component-to-restrict-access-to-protected-pages
export default function PrivateRoute({ children }) {
    const signedIn = false; // TODO: useSelector() for actual login state
    const location = useLocation();

    if (!signedIn) {
        return <Navigate to='/login' state={{ from: location }} />;
    }

    return children;
}
