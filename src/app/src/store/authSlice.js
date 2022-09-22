import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    signedIn: false,
    locationBeforeAuth: '/welcome',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: state => {
            state.signedIn = true;
        },
        logout: state => {
            state.signedIn = false;
        },
        setLocationBeforeAuth: (state, { payload: location }) => {
            if (!location.pathname.startsWith('/login')) {
                state.locationBeforeAuth = location;
            }
        },
    },
});

export const { login, logout, setLocationBeforeAuth } = authSlice.actions;

export default authSlice.reducer;
