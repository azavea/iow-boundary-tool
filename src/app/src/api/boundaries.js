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
                body: newBoundary,
            }),
            invalidatesTags: getNewItemTagInvalidator(TAGS.BOUNDARY),
        }),

        submitBoundary: build.mutation({
            query: id => ({
                url: `/boundaries/${id}/submit/`,
                method: 'POST',
            }),
            invalidatesTags: getUpdateItemTagInvalidator(TAGS.BOUNDARY),
        }),

        uploadReferenceImage: build.mutation({
            query: newSubmission => ({
                url: `/boundaries/${newSubmission.boundary}/reference-images/`,
                method: 'POST',
                data: newSubmission,
            }),
            invalidatesTags: getUpdateItemTagInvalidator(TAGS.BOUNDARY),
        }),

        updateReferenceImage: build.mutation({
            query: updatedSubmission => ({
                url: `/boundaries/${updatedSubmission.boundary}/reference-images/${updatedSubmission.id}/`,
                method: 'PUT',
                data: updatedSubmission,
            }),
            invalidatesTags: getUpdateItemTagInvalidator(TAGS.BOUNDARY),
        }),
    }),
});

export const {
    useGetBoundariesQuery,
    useGetBoundaryDetailsQuery,
    useStartNewBoundaryMutation,
    useSubmitBoundaryMutation,
    useUploadReferenceImageMutation,
    useUpdateReferenceImageMutation,
} = boundaryApi;
