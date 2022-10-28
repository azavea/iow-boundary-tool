import api from './api';
import TAGS, { getUpdateItemTagInvalidator } from './tags';

const reviewApi = api.injectEndpoints({
    endpoints: build => ({
        startReview: build.mutation({
            query: boundaryId => ({
                url: `/boundaries/${boundaryId}/review`,
                method: 'POST',
            }),
            invalidatesTags: getUpdateItemTagInvalidator(TAGS.BOUNDARY),
        }),
    }),
});

export const { useStartReviewMutation } = reviewApi;
