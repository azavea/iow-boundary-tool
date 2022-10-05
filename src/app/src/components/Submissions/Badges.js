import { Badge } from '@chakra-ui/react';

export function SubmittedBadge({ variant = 'solidFixedHeight' }) {
    return (
        <Badge bg='#38B2AC' variant={variant} colorScheme='green'>
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
