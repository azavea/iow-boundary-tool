import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import mapReducer from './mapSlice';

export default configureStore({
    reducer: {
        auth: authReducer,
        map: mapReducer,
    },
});
