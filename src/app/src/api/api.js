import { createApi } from '@reduxjs/toolkit/query/react';

import apiClient from './client';
import { BASE_API_URL } from '../constants';

import TAGS from './tags';

const axiosBaseQuery = ({ url, ...axiosParams }) =>
    apiClient({ url: `${BASE_API_URL}${url}`, ...axiosParams })
        .then(result => ({ data: result.data }))
        .catch(error => ({
            error: {
                status: error.response?.status,
                data: error.response?.data || error.message,
            },
        }));

export default createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery,
    tagTypes: Object.values(TAGS),
    endpoints: () => ({}),
});
