import { configureStore } from '@reduxjs/toolkit';

import api from '../api';
import authReducer from './authSlice';
import mapReducer from './mapSlice';

export default configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        map: mapReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(api.middleware),
});
