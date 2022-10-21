import api from './api';

const referenceImagesApi = api.injectEndpoints({
    endpoints: build => ({
        uploadReferenceImage: build.mutation({
            query: ({ boundary, ...details }) => ({
                url: `/boundaries/${boundary}/reference-images/`,
                method: 'POST',
                data: details,
            }),
        }),
        updateReferenceImage: build.mutation({
            query: ({ boundary, referenceImageId, ...details }) => ({
                url: `/boundaries/${boundary}/reference-images/${referenceImageId}/`,
                method: 'PUT',
                data: details,
            }),
        }),
    }),
});

export const {
    useUploadReferenceImageMutation,
    useUpdateReferenceImageMutation,
} = referenceImagesApi;
