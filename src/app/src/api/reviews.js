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

        finishReview: build.mutation({
            query: ({ boundaryId, notes }) => ({
                url: `/boundaries/${boundaryId}/review/finish/`,
                method: 'POST',
                data: { notes },
            }),
            invalidatesTags: (result, error, { boundaryId }) => [
                { tag: TAGS.BOUNDARY, id: boundaryId },
            ],
        }),
    }),
});

export const { useStartReviewMutation, useFinishReviewMutation } = reviewApi;
