import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    locationBeforeAuth: '/welcome',
    utilities: [],
    selectedUtility: null,
    user: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, { payload: user }) => {
            state.user = user;
        },
        logout: state => {
            state.user = false;
        },
        setLocationBeforeAuth: (state, { payload: location }) => {
            if (!location.pathname.startsWith('/login')) {
                state.locationBeforeAuth = location;
            }
        },
        setUtilities: (state, { payload: utilities }) => {
            state.utilities = utilities;
        },
        setSelectedUtility: (state, { payload: selectedUtility }) => {
            state.selectedUtility = selectedUtility;
        },
    },
});

export const {
    login,
    logout,
    setLocationBeforeAuth,
    setUtilities,
    setSelectedUtility,
} = authSlice.actions;

export default authSlice.reducer;
