import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import L from './L.DistortableImage.Edit.fix';

import { customizePrototypeIcon } from '../../utils';
import { updateReferenceImage } from '../../store/mapSlice';
import { useEndpointToastError } from '../../hooks';
import { useUpdateReferenceImageMutation } from '../../api/boundaries';
import { useMap } from 'react-leaflet';

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
    const dispatch = useDispatch();
    const map = useMap();
    const referenceImageLayers = useRef({});
    const [postReferenceImage, { error }] = useUpdateReferenceImageMutation();
    useEndpointToastError(error);

    const images = useSelector(state => state.map.referenceImages);

    const visibleImages = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(images).filter(
                    ([, imageInfo]) => imageInfo.visible
                )
            ),
        [images]
    );

    const createLayer = useCallback(
        ({ url, id, boundary, corners, mode }) => {
            const layer = new L.distortableImageOverlay(url, {
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
                mode,
                corners: corners
                    ? corners.map(convertCornerFromStateFormat)
                    : null,
            });

            const updateImageHandler = ({ target: layer }) => {
                dispatch(
                    updateReferenceImage({
                        url,
                        update: {
                            corners: layer._corners.map(
                                convertCornerToStateFormat
                            ),
                            mode: layer.editing._mode,
                            transparent: layer.editing._transparent,
                        },
                    })
                );
                postReferenceImage({
                    boundary,
                    referenceImageId: id,
                    distortion: layer._corners,
                    opacity: layer.editing._transparent ? 50 : 0,
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
                        dispatch(
                            updateReferenceImage({
                                url,
                                update: {
                                    corners: layer._corners.map(
                                        convertCornerToStateFormat
                                    ),
                                },
                            })
                        );
                    }
                });
            }

            return layer;
        },
        [dispatch, postReferenceImage]
    );

    /**
     * Since the reference image layers are stored in a mutable ref,
     * they aren't updated when the redux state changes. This useEffect
     * hook manually performs those updates by listening to changes of
     * visibleImages.
     */
    useEffect(() => {
        const imageShouldBeAdded = url =>
            !(url in referenceImageLayers.current);

        const imageShouldBeHidden = url => !(url in visibleImages);

        for (const [url, { id, boundary, corners, mode }] of Object.entries(
            visibleImages
        )) {
            if (imageShouldBeAdded(url)) {
                referenceImageLayers.current[url] = createLayer({
                    url,
                    id,
                    boundary,
                    corners,
                    mode,
                });

                map.addLayer(referenceImageLayers.current[url]);
            }
        }

        for (const url of Object.keys(referenceImageLayers.current)) {
            if (imageShouldBeHidden(url)) {
                if (map.hasLayer(referenceImageLayers.current[url])) {
                    map.removeLayer(referenceImageLayers.current[url]);
                }

                delete referenceImageLayers.current[url];
            }
        }
    }, [visibleImages, map, createLayer]);
}
