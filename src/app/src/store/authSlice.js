import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    signedIn: false,
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
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
