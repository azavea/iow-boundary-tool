import { useDispatch } from 'react-redux';
import { DEBOUNCE_INTERVAL } from '../constants';
import { useTrailingDebounceCallback } from '../hooks';
import api from './api';

const referenceImagesApi = api.injectEndpoints({
    endpoints: build => ({
        uploadReferenceImage: build.mutation({
            query: ({ boundaryId, ...details }) => ({
                url: `/boundaries/${boundaryId}/reference-images/`,
                method: 'POST',
                data: details,
            }),
            onQueryStarted: async (
                { boundaryId },
                { dispatch, queryFulfilled }
            ) => {
                try {
                    const { data: newImage } = await queryFulfilled;

                    dispatch(
                        api.util.updateQueryData(
                            'getBoundaryDetails',
                            boundaryId,
                            draftDetails => {
                                draftDetails.reference_images.push(newImage);
                            }
                        )
                    );
                    // No action needed if POST fails
                    // Error will still be accessible from mutation hook
                } catch {}
            },
        }),
        updateReferenceImage: build.mutation({
            query: ({ boundaryId, id, ...details }) => ({
                url: `/boundaries/${boundaryId}/reference-images/${id}/`,
                method: 'PUT',
                data: details,
            }),
            // no onQueryStarted to update getBoundaryDetails here because
            // it is handled by the debounced callback in Sidebar.js
        }),
    }),
});

export function useDebouncedUpdateReferenceImageMutation(
    boundaryId,
    canWrite = false
) {
    const dispatch = useDispatch();
    const [updateReferenceImage, meta] = useUpdateReferenceImageMutation();

    const debouncedUpdate = useTrailingDebounceCallback({
        callback: updatedImage => {
            canWrite && updateReferenceImage({ boundaryId, ...updatedImage });
        },
        immediateCallback: updatedImage => {
            dispatch(
                api.util.updateQueryData(
                    'getBoundaryDetails',
                    boundaryId,
                    draftDetails => {
                        const shouldUpdate = image =>
                            image.id === updatedImage.id;

                        draftDetails.reference_images =
                            draftDetails.reference_images.map(image =>
                                shouldUpdate(image)
                                    ? { ...image, ...updatedImage }
                                    : image
                            );
                    }
                )
            );
        },
        interval: DEBOUNCE_INTERVAL,
    });

    return [debouncedUpdate, meta];
}

export const {
    useUploadReferenceImageMutation,
    useUpdateReferenceImageMutation,
} = referenceImagesApi;
