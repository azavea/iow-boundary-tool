import api from './api';

const annotationApi = api.injectEndpoints({
    endpoints: build => ({
        createAnnotation: build.mutation({
            query: ({ boundaryId, ...data }) => ({
                url: `/boundaries/${boundaryId}/review/annotations/`,
                method: 'POST',
                data,
            }),
            onQueryStarted: async (
                { boundaryId, ...newAnnotation },
                { dispatch, queryFulfilled }
            ) => {
                try {
                    const { data: id } = await queryFulfilled;
                    dispatch(
                        api.util.updateQueryData(
                            'getBoundaryDetails',
                            boundaryId,
                            draftDetails => {
                                draftDetails.submission.review.annotations.push(
                                    { ...newAnnotation, id }
                                );
                            }
                        )
                    );
                } catch {}
            },
        }),
        updateAnnotation: build.mutation({
            query: ({ boundaryId, id, ...data }) => ({
                url: `/boundaries/${boundaryId}/review/annotations/${id}/`,
                method: 'PUT',
                data,
            }),
            onQueryStarted: async (
                { boundaryId, ...updatedAnnotation },
                { dispatch, queryFulfilled }
            ) => {
                try {
                    await queryFulfilled;

                    dispatch(
                        api.util.updateQueryData(
                            'getBoundaryDetails',
                            boundaryId,
                            draftDetails => {
                                const shouldUpdate = annotation =>
                                    annotation.id === updatedAnnotation.id;

                                draftDetails.submission.review.annotations =
                                    draftDetails.submission.review.annotations.map(
                                        annotation =>
                                            shouldUpdate(annotation)
                                                ? updatedAnnotation
                                                : annotation
                                    );
                            }
                        )
                    );
                } catch {}
            },
        }),

        deleteAnnotation: build.mutation({
            query: ({ boundaryId, id }) => ({
                url: `/boundaries/${boundaryId}/review/annotations/${id}/`,
                method: 'DELETE',
            }),
            onQueryStarted: async (
                { boundaryId, id: deleteAnnotationId },
                { dispatch, queryFulfilled }
            ) => {
                try {
                    await queryFulfilled;

                    dispatch(
                        api.util.updateQueryData(
                            'getBoundaryDetails',
                            boundaryId,
                            draftDetails => {
                                draftDetails.submission.review.annotations =
                                    draftDetails.submission.review.annotations.filter(
                                        annotation =>
                                            annotation.id !== deleteAnnotationId
                                    );
                            }
                        )
                    );
                } catch {}
            },
        }),
    }),
});

export const {
    useCreateAnnotationMutation,
    useUpdateAnnotationMutation,
    useDeleteAnnotationMutation,
} = annotationApi;
