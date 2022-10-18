import { createSlice } from '@reduxjs/toolkit';

import { ROLES } from '../constants';

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

            // Contributors must choose a utility if there are multiple
            if (
                user.utilities &&
                (user.role !== ROLES.CONTRIBUTOR || user.utilities.length === 1)
            ) {
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
