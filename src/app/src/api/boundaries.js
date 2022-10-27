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
            query: ({ utilities }) => ({
                url: '/boundaries/',
                method: 'GET',
                params: { utilities },
            }),
            providesTags: getListTagProvider(TAGS.BOUNDARY),
        }),

        getBoundaryDetails: build.query({
            query: id => ({
                url: `/boundaries/${id}/`,
                method: 'GET',
            }),
            providesTags: getSingleItemProvider(TAGS.BOUNDARY),
            transformResponse: (response, meta, id) => ({ ...response, id }),
        }),

        startNewBoundary: build.mutation({
            query: ({ reference_images, shape, ...details }) => {
                const formData = new FormData();
                const referenceImagesMeta = [];

                for (const reference_image of reference_images) {
                    formData.append(
                        'reference_images[]',
                        reference_image,
                        reference_image.name
                    );

                    referenceImagesMeta.push(
                        JSON.stringify({
                            filename: reference_image.name,
                            visible: true,
                            distortion: null,
                            mode: 'distort',
                            opacity: 100,
                        })
                    );
                }

                formData.append('reference_images_meta', referenceImagesMeta);

                if (shape) {
                    formData.append('shape', shape, shape.name);
                }

                for (const [key, value] of Object.entries(details)) {
                    formData.append(key, value);
                }

                return {
                    url: '/boundaries/',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    data: formData,
                };
            },
            invalidatesTags: getNewItemTagInvalidator(TAGS.BOUNDARY),
        }),

        updateBoundaryShape: build.mutation({
            query: ({ id, shape }) => ({
                url: `/boundaries/${id}/shape/`,
                method: 'PUT',
                data: shape,
            }),
        }),

        deleteBoundaryShape: build.mutation({
            query: id => ({
                url: `/boundaries/${id}/shape/`,
                method: 'DELETE',
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    dispatch(
                        api.util.updateQueryData(
                            'getBoundaryDetails',
                            id,
                            draftDetails => {
                                draftDetails.submission.shape = null;
                            }
                        )
                    );
                } catch {}
            },
        }),

        submitBoundary: build.mutation({
            query: ({ id, payload }) => ({
                url: `/boundaries/${id}/submit/`,
                method: 'PATCH',
                data: payload,
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
    useDeleteBoundaryShapeMutation,
    useSubmitBoundaryMutation,
} = boundaryApi;
