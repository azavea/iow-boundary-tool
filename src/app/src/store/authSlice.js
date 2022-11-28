import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: false,
    utility: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, { payload: user }) => {
            state.user = user;
            state.utility = null;
        },
        logout: state => {
            state.user = false;
        },
        setUtilityByPwsid: (state, { payload: pwsid }) => {
            state.utility = state.user.utilities.find(u => u.pwsid === pwsid);
        },
    },
});

export const { login, logout, setUtilityByPwsid } = authSlice.actions;

export default authSlice.reducer;
