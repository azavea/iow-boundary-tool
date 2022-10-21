import { useCallback, useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';

import { convertIndexedObjectToArray } from './utils';
import { useParams } from 'react-router';

export function useDialogController(initialState = false) {
    const [isOpen, setIsOpen] = useState(initialState);

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

export function useMapLayer(layer, { fitBounds = false } = {}) {
    const map = useMap();

    useEffect(() => {
        map.addLayer(layer);

        if (fitBounds) {
            map.fitBounds(layer.getBounds());
        }

        return () => {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        };
    }, [map, layer, fitBounds]);
}

export function useLayerVisibility(layer) {
    return useSelector(state => state.map.layers).includes(layer);
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

export function useBoundaryId() {
    return useParams().boundaryId;
}

/**
 * Debounce a callback
 * @template CallbackFunction
 * @param {CallbackFunction} callback - A function to be called after no calls have been
 *  made to the returned callback for the duration of the interval. Its impending call
 *  will be replaced by newer ones.
 * @param {CallbackFunction} immediateCallback - A function to be called immediately
 *  after calling the returned callback
 * @param {number} interval
 * @returns CallbackFunction
 */
export function useTrailingDebounceCallback({
    callback,
    immediateCallback,
    interval,
}) {
    const timeout = useRef();

    return useCallback(
        (...args) => {
            const scheduledCallback = () => {
                callback(...args);
            };

            clearTimeout(timeout.current);
            timeout.current = setTimeout(scheduledCallback, interval);

            if (immediateCallback) {
                immediateCallback(...args);
            }
        },
        [callback, immediateCallback, interval]
    );
}

export function useEndpointToastError(error, message = 'An error occured') {
    const toast = useToast();

    useEffect(() => {
        if (error) {
            toast({
                title: message,
                status: 'error',
                isClosable: true,
                duration: 5000,
            });
        }
    }, [error, message, toast]);
}
