import { renderToString } from 'react-dom/server';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Button, Divider, Flex } from '@chakra-ui/react';

import { AnnotationIcon } from '@heroicons/react/solid';

import { useDrawBoundary, useDrawPermissions } from '../DrawContext';

import { PANES } from '../../constants';

export default function AnnotationMarkers() {
    const annotations = useDrawBoundary().submission?.review?.annotations;

    if (!annotations) {
        return null;
    }

    return (
        <>
            {annotations.map(annotation => (
                <AnnotationMarker key={annotation.id} annotation={annotation} />
            ))}
        </>
    );
}

function AnnotationMarker({
    annotation: {
        id,
        location: { coordinates },
    },
}) {
    const { canReview } = useDrawPermissions();

    return (
        <Marker
            position={[coordinates[1], coordinates[0]]}
            pane={PANES.ANNOTATION_MARKERS.label}
            icon={L.divIcon({
                html: renderToString(
                    <AnnotationIcon style={{ width: 16, height: 16 }} />
                ),
                className: 'annotation-marker-div',
            })}
        >
            <Popup
                closeButton={false}
                pane={PANES.ANNOTATION_POPUPS.label}
                className='annotation-popup-div'
                minWidth={canReview ? 124 : 60}
                offset={[2, 7]}
            >
                <Flex
                    align='center'
                    height='100%'
                    justify='space-between'
                    marginLeft={3}
                    marginRight={3}
                >
                    <Button variant='annotationLink'>View</Button>
                    {canReview && (
                        <>
                            <Divider
                                orientation='vertical'
                                height='17px'
                                color='gray.600'
                            />
                            <Button variant='annotationLink'>Delete</Button>
                        </>
                    )}
                </Flex>
            </Popup>
        </Marker>
    );
}
