import { useCallback, useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';

import { convertIndexedObjectToArray } from './utils';
import {
    createDefaultReferenceImage,
    updateReferenceImage,
} from './store/mapSlice';
import { useUploadReferenceImageMutation } from './api/boundaries';

export function useDialogController() {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    return {
        isOpen,
        open,
        close,
    };
}

export function usePreventMapDoubleClick() {
    const ref = useRef();

    useEffect(() => {
        if (ref.current) {
            const thisWasClicked = event =>
                event.target === ref.current ||
                ref.current.contains(event.target);

            const doubleClickGuard = event => {
                if (thisWasClicked(event)) {
                    event.stopPropagation();
                }
            };

            document.body.addEventListener('dblclick', doubleClickGuard, {
                capture: true,
            });

            return () =>
                document.body.removeEventListener(
                    'dblclick',
                    doubleClickGuard,
                    { capture: true }
                );
        }
    }, [ref]);

    return ref;
}

export function useSetMaxZoomLevel(maxZoomLevel) {
    const map = useMap();

    useEffect(() => {
        map.setMaxZoom(maxZoomLevel);
    }, [maxZoomLevel, map]);
}

export function useMapLayer(layer) {
    const map = useMap();

    useEffect(() => {
        map.addLayer(layer);

        return () => {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        };
    }, [map, layer]);
}

export function useLayerVisibility(layer) {
    return useSelector(state => state.map.layers).includes(layer);
}

export function useAddReferenceImage() {
    const dispatch = useDispatch();
    const [uploadImage, { isLoading }] = useUploadReferenceImageMutation();

    const addReferenceImage = file => {
        const url = URL.createObjectURL(file);

        uploadImage({
            boundary: 1, // TODO: get the actual boundary
            filename: file.name,
            is_visible: true,
            distortion: null,
        });
        dispatch(
            updateReferenceImage({
                url,
                update: createDefaultReferenceImage(file.name),
            })
        );
    };

    return [addReferenceImage, isLoading];
}

export function useFilePicker(onChange) {
    const openFileDialog = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = handlePickFiles;
        input.accept = 'image/png, image/jpeg, .png, .jpg, .jpeg';

        input.click();
    };

    const handlePickFiles = event => {
        onChange(convertIndexedObjectToArray(event.target.files));
        event.target.remove();
    };

    return openFileDialog;
}
