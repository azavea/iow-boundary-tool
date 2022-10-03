import api from './api';
import TAGS, {
    getListTagProvider,
    getNewItemTagInvalidator,
    getSingleItemProvider,
    getUpdateItemTagInvalidator,
} from './tags';

const submissionApi = api.injectEndpoints({
    endpoints: build => ({
        getDraftSubmissions: build.query({
            query: () => ({
                url: '/submissions',
                method: 'GET',
                params: { type: 'drafts' },
            }),
            providesTags: getListTagProvider(TAGS.SUBMISSION),
        }),

        getSubmissionDetails: build.query({
            query: id => ({
                url: `/submissions/${id}`,
                method: 'GET',
            }),
            providesTags: getSingleItemProvider(TAGS.SUBMISSION),
        }),

        startNewSubmission: build.mutation({
            query: newSubmission => ({
                url: '/submissions',
                method: 'POST',
                body: newSubmission,
            }),
            invalidatesTags: getNewItemTagInvalidator(TAGS.SUBMISSION),
        }),

        submitSubmission: build.mutation({
            query: id => ({
                url: `/submissions/submit/${id}`,
                method: 'POST',
            }),
            invalidatesTags: getUpdateItemTagInvalidator(TAGS.SUBMISSION),
        }),
    }),
});

export const {
    useGetDraftSubmissionsQuery,
    useGetSubmissionDetailsQuery,
    useStartNewSubmissionMutation,
    useSubmitSubmissionMutation,
} = submissionApi;
