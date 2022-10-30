import { useCallback, useEffect, useMemo, useRef } from 'react';

import L from './L.DistortableImage.Edit.fix';

import { customizePrototypeIcon } from '../../utils';
import { useBoundaryId, useEndpointToastError } from '../../hooks';
import { useMap } from 'react-leaflet';
import { useDebouncedUpdateReferenceImageMutation } from '../../api/referenceImages';
import { useDrawBoundary, useDrawPermissions } from '../DrawContext';

customizePrototypeIcon(L.DistortHandle.prototype, 'ref-handle');
customizePrototypeIcon(L.DragHandle.prototype, 'ref-handle');
customizePrototypeIcon(L.FreeRotateHandle.prototype, 'ref-handle');
customizePrototypeIcon(L.RotateHandle.prototype, 'ref-handle');
customizePrototypeIcon(L.ScaleHandle.prototype, 'ref-handle');

const convertCornerToStateFormat = corner => [corner.lat, corner.lng];
const convertCornerFromStateFormat = corner => ({
    lat: corner[0],
    lng: corner[1],
});

export default function ReferenceImageLayer() {
    const map = useMap();
    const boundaryId = useBoundaryId();
    const referenceImageLayers = useRef({});
    const images = useDrawBoundary().reference_images;
    const { canWrite } = useDrawPermissions();

    const [updateReferenceImage, { error }] =
        useDebouncedUpdateReferenceImageMutation(boundaryId, canWrite);
    useEndpointToastError(error);

    const visibleImages = useMemo(
        () =>
            Object.fromEntries(
                images
                    .filter(imageInfo => imageInfo.is_visible)
                    .map(image => [image.id, image])
            ),
        [images]
    );

    const createLayer = useCallback(
        ({ id, corners, mode }) => {
            // TODO use reference image url here
            const layer = new L.distortableImageOverlay('', {
                actions: [
                    L.DragAction,
                    L.ScaleAction,
                    L.DistortAction,
                    L.RotateAction,
                    L.FreeRotateAction,
                    L.LockAction,
                    L.OpacityAction,
                    L.BorderAction,
                ],
                selected: true,
                editable: canWrite,
                mode,
                corners: corners
                    ? corners.map(convertCornerFromStateFormat)
                    : null,
            });

            const updateImageHandler = ({ target: layer }) => {
                updateReferenceImage({
                    id,
                    distortion: layer._corners.map(convertCornerToStateFormat),
                    mode: layer.editing._mode,
                    is_visible: true, // because layer must be visible to be updated
                    opacity: layer.editing._transparent ? 50 : 100,
                });
            };

            layer.on('edit', updateImageHandler);
            layer.on('dragend', updateImageHandler);
            layer.on('refresh', updateImageHandler);

            /**
             * This is handler is added to save the default position of the
             * reference image. It uses the remove event because the corners
             * don't always exist on the add event. Also, corners might not
             * be set for some remove events, so their existence is
             * verified before dispatching an update,
             */
            if (!corners) {
                layer.on('remove', ({ target: layer }) => {
                    if (layer._corners) {
                        updateReferenceImage({
                            id,
                            distortion: layer._corners.map(
                                convertCornerToStateFormat
                            ),
                        });
                    }
                });
            }

            return layer;
        },
        [canWrite, updateReferenceImage]
    );

    /**
     * Since the reference image layers are stored in a mutable ref,
     * they aren't updated when the redux state changes. This useEffect
     * hook manually performs those updates by listening to changes of
     * visibleImages.
     */
    useEffect(() => {
        const imageShouldBeAdded = id => !(id in referenceImageLayers.current);
        const imageShouldBeHidden = id => !(id in visibleImages);

        for (const { id, distortion, mode } of Object.values(visibleImages)) {
            if (imageShouldBeAdded(id)) {
                referenceImageLayers.current[id] = createLayer({
                    id,
                    corners: distortion,
                    mode,
                });

                map.addLayer(referenceImageLayers.current[id]);
            }
        }

        for (const id of Object.keys(referenceImageLayers.current)) {
            if (imageShouldBeHidden(id)) {
                if (map.hasLayer(referenceImageLayers.current[id])) {
                    map.removeLayer(referenceImageLayers.current[id]);
                }

                delete referenceImageLayers.current[id];
            }
        }
    }, [visibleImages, map, createLayer]);
}
