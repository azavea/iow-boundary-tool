import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import L from './L.DistortableImage.Edit.fix';
import ReferenceImage from '../../img/raleigh_sanborn_map.jpg';

import { useMapLayer } from '../../hooks';
import { customizePrototypeIcon } from '../../utils';
import { updateReferenceImage } from '../../store/mapSlice';

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

export default function ReferenceImageLayerVisbilityWrapper() {
    const showLayer = useSelector(state => state.map.referenceImage.visible);

    return showLayer ? <ReferenceImageLayer /> : null;
}

function ReferenceImageLayer() {
    const dispatch = useDispatch();

    // TODO: Find a way to initialize the image with transparent/outlined enabled
    const { corners, mode } = useSelector(state => state.map.referenceImage);

    const layer = useMemo(
        () => {
            const layer = new L.distortableImageOverlay(ReferenceImage, {
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
                        corners: layer._corners.map(convertCornerToStateFormat),
                        mode: layer.editing._mode,
                        transparent: layer.editing._transparent,
                    })
                );
            };

            layer.on('edit', updateImageHandler);
            layer.on('dragend', updateImageHandler);
            layer.on('refresh', updateImageHandler);

            return layer;
        },
        // TODO: Figure out how to prevent deselect on re-render
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            // corners,
            // mode,
            dispatch,
        ]
    );

    useMapLayer(layer);
}
