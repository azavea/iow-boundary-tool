import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    locationBeforeAuth: '/welcome',
    user: false,
    utility: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, { payload: user }) => {
            state.user = user;

            if (user.utilities) {
                state.utility = user.utilities[0];
            }
        },
        logout: state => {
            state.user = false;
        },
        setLocationBeforeAuth: (state, { payload: location }) => {
            if (!location.pathname.startsWith('/login')) {
                state.locationBeforeAuth = location;
            }
        },
        setUtilityByPwsid: (state, { payload: pwsid }) => {
            state.utility = state.user.utilities.find(u => u.pwsid === pwsid);
        },
    },
});

export const { login, logout, setLocationBeforeAuth, setUtilityByPwsid } =
    authSlice.actions;

export default authSlice.reducer;
