import api from './api';
import TAGS, {
    getListTagProvider,
    getNewItemTagInvalidator,
    getSingleItemProvider,
    getUpdateItemTagInvalidator,
} from './tags';

const boundaryApi = api.injectEndpoints({
    endpoints: build => ({
        getBoundaries: build.query({
            query: () => ({
                url: '/boundaries/',
                method: 'GET',
            }),
            providesTags: getListTagProvider(TAGS.BOUNDARY),
        }),

        getBoundaryDetails: build.query({
            query: id => ({
                url: `/boundaries/${id}/`,
                method: 'GET',
            }),
            providesTags: getSingleItemProvider(TAGS.BOUNDARY),
        }),

        startNewBoundary: build.mutation({
            query: newBoundary => ({
                url: '/boundaries/',
                method: 'POST',
                data: newBoundary,
            }),
            invalidatesTags: getNewItemTagInvalidator(TAGS.BOUNDARY),
        }),

        updateBoundaryShape: build.mutation({
            query: ({ id, shape }) => ({
                url: `/boundaries/${id}/shape/`,
                method: 'POST',
                data: shape,
            }),
        }),

        submitBoundary: build.mutation({
            query: id => ({
                url: `/boundaries/${id}/submit/`,
                method: 'POST',
            }),
            invalidatesTags: getUpdateItemTagInvalidator(TAGS.BOUNDARY),
        }),
    }),
});

export const {
    useGetBoundariesQuery,
    useGetBoundaryDetailsQuery,
    useStartNewBoundaryMutation,
    useUpdateBoundaryShapeMutation,
    useSubmitBoundaryMutation,
} = boundaryApi;
