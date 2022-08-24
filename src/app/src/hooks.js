import { useCallback, useEffect, useRef, useState } from 'react';

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
