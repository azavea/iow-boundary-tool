import { useState } from 'react';

import useAddCursor from './useAddCursor';
import { AddAnnotationModal } from './AnnotationModals';

export default function AddAnnotation() {
    const [location, setLocation] = useState(null);

    useAddCursor(event =>
        setLocation({
            type: 'Point',
            coordinates: [event.latlng.lng, event.latlng.lat],
        })
    );

    return (
        <AddAnnotationModal
            location={location}
            onClose={() => setLocation(null)}
        />
    );
}
