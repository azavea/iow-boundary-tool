import { Badge } from '@chakra-ui/react';

export function SubmittedBadge({ variant = 'solidFixedHeight' }) {
    return (
        <Badge bg='teal.400' variant={variant} colorScheme='green'>
            SUBMITTED
        </Badge>
    );
}

export function DraftBadge({ variant = 'solidFixedHeight' }) {
    return (
        <Badge variant={variant} colorScheme='yellow'>
            DRAFT
        </Badge>
    );
}
