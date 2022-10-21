import api from './api';

const reviewApi = api.injectEndpoints({
    endpoints: build => ({
        startReview: build.mutation({
            query: boundaryId => ({
                url: `/boundaries/${boundaryId}/review`,
                method: 'POST',
            }),
        }),
    }),
});

export const { useStartReviewMutation } = reviewApi;
