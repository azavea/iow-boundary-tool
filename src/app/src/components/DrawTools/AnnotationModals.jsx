import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
    Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import {
    useCreateAnnotationMutation,
    useDeleteAnnotationMutation,
    useUpdateAnnotationMutation,
} from '../../api/annotations';
import { useBoundaryId, useEndpointToastError } from '../../hooks';
import { useDrawPermissions } from '../DrawContext';

export function AddAnnotationModal({ location, onClose }) {
    const boundaryId = useBoundaryId();

    const [createAnnotation, { error, isLoading }] =
        useCreateAnnotationMutation();
    useEndpointToastError(error);

    const { Textarea, comment, resetComment } = useAnnotationComment('');

    const resetCommentAndClose = () => {
        resetComment();
        onClose();
    };

    const onSubmit = () => {
        createAnnotation({ boundaryId, comment, location })
            .unwrap()
            .then(resetCommentAndClose);
    };

    return (
        <AnnotationModalBase
            headerText='Add comment'
            isOpen={!!location}
            onClose={resetCommentAndClose}
            onSubmit={onSubmit}
            isLoading={isLoading}
            body={Textarea}
        />
    );
}

export function ViewAnnotationModal({ annotation, onClose }) {
    const { canReview } = useDrawPermissions();

    if (canReview) {
        return (
            <EditAnnotationModal annotation={annotation} onClose={onClose} />
        );
    }

    return (
        <ReadOnlyAnnotationModal annotation={annotation} onClose={onClose} />
    );
}

function EditAnnotationModal({ annotation, onClose }) {
    const boundaryId = useBoundaryId();

    const [updateAnnotation, { error, isLoading }] =
        useUpdateAnnotationMutation();
    useEndpointToastError(error);

    const onSubmit = () => {
        updateAnnotation({ boundaryId, ...annotation, comment })
            .unwrap()
            .then(onClose);
    };

    const { Textarea, comment } = useAnnotationComment(annotation?.comment);

    return (
        <AnnotationModalBase
            headerText='Edit comment'
            isOpen={!!annotation}
            onClose={onClose}
            onSubmit={onSubmit}
            isLoading={isLoading}
            body={Textarea}
        />
    );
}

function ReadOnlyAnnotationModal({ annotation, onClose }) {
    return (
        <AnnotationModalBase
            headerText='View comment'
            isOpen={!!annotation}
            onClose={onClose}
            body={<Text color='gray.900'>{annotation?.comment}</Text>}
        />
    );
}

export function DeleteAnnotationModal({ annotation, onClose }) {
    const boundaryId = useBoundaryId();

    const [deleteAnnotation, { error, isLoading }] =
        useDeleteAnnotationMutation();
    useEndpointToastError(error);

    const onSubmit = () => {
        deleteAnnotation({ boundaryId, id: annotation.id })
            .unwrap()
            .then(onClose);
    };

    return (
        <AnnotationModalBase
            headerText='Delete comment'
            isOpen={!!annotation}
            onClose={onClose}
            onSubmit={onSubmit}
            isLoading={isLoading}
            ctaLabel='Delete'
            body={
                <>
                    <Text mb={2}>
                        Are you sure you want to delete this comment?
                    </Text>
                    <Textarea value={annotation?.comment} disabled />
                </>
            }
        />
    );
}

function useAnnotationComment(commentProp) {
    const [comment, setComment] = useState(commentProp ?? '');

    useEffect(() => {
        setComment(commentProp ?? '');
    }, [commentProp]);

    return {
        Textarea: (
            <Textarea
                value={comment}
                onChange={event => setComment(event.target.value)}
            />
        ),
        comment,
        resetComment: () => setComment(''),
    };
}

function AnnotationModalBase({
    isOpen,
    onClose,
    onSubmit,
    headerText,
    ctaLabel = 'Save',
    body,
    isLoading,
}) {
    return (
        <Modal size='md' isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader textAlign='center' m={4} mb={2}>
                        {headerText}
                    </ModalHeader>
                    <ModalBody mx={4}>{body}</ModalBody>
                    <ModalFooter>
                        <Flex w='100%' m={4} mt={2}>
                            <Button
                                variant='secondary'
                                onClick={onClose}
                                disabled={isLoading}
                                width={onSubmit ? undefined : '100%'}
                            >
                                Back
                            </Button>

                            {onSubmit && (
                                <>
                                    <Spacer />
                                    <Button
                                        variant='cta'
                                        onClick={() => {
                                            onSubmit();
                                        }}
                                        isLoading={isLoading}
                                    >
                                        {ctaLabel}
                                    </Button>
                                </>
                            )}
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
}
