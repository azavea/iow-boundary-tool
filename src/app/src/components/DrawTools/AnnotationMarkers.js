import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Button, Divider, Flex } from '@chakra-ui/react';

import { AnnotationIcon } from '@heroicons/react/solid';

import { useDrawBoundary, useDrawPermissions } from '../DrawContext';

import { BOUNDARY_STATUS, PANES } from '../../constants';
import { DeleteAnnotationModal, ViewAnnotationModal } from './AnnotationModals';

export default function AnnotationMarkers() {
    const boundary = useDrawBoundary();

    const annotations =
        boundary.status === BOUNDARY_STATUS.IN_REVIEW ||
        boundary.status === BOUNDARY_STATUS.NEEDS_REVISIONS
            ? boundary.submission.review.annotations
            : boundary.status === BOUNDARY_STATUS.DRAFT
            ? boundary?.previous_submission?.review.annotations
            : null;

    const [annotationToDelete, setAnnotationToDelete] = useState(null);
    const [annotationToView, setAnnotationToView] = useState(null);

    if (!annotations) {
        return null;
    }

    return (
        <>
            {annotations.map(annotation => (
                <AnnotationMarker
                    key={annotation.id}
                    annotation={annotation}
                    setAnnotationToDelete={setAnnotationToDelete}
                    setAnnotationToView={setAnnotationToView}
                />
            ))}

            <DeleteAnnotationModal
                annotation={annotationToDelete}
                onClose={() => setAnnotationToDelete(null)}
            />
            <ViewAnnotationModal
                annotation={annotationToView}
                onClose={() => setAnnotationToView(null)}
            />
        </>
    );
}

function AnnotationMarker({
    annotation,
    setAnnotationToDelete,
    setAnnotationToView,
}) {
    const coordinates = annotation.location.coordinates;
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
                    <Button
                        variant='annotationLink'
                        onClick={() => setAnnotationToView(annotation)}
                    >
                        View
                    </Button>
                    {canReview && (
                        <>
                            <Divider
                                orientation='vertical'
                                height='17px'
                                color='gray.600'
                            />
                            <Button
                                variant='annotationLink'
                                onClick={() =>
                                    setAnnotationToDelete(annotation)
                                }
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </Flex>
            </Popup>
        </Marker>
    );
}
