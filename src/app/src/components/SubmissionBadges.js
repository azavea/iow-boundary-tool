import { Badge } from '@chakra-ui/react';

export function SubmittedBadge() {
    return (
        <Badge bg='#38B2AC' variant='solid' colorScheme='green'>
            SUBMITTED
        </Badge>
    );
}

export function DraftBadge() {
    return (
        <Badge variant='solid' colorScheme='yellow'>
            DRAFT
        </Badge>
    );
}
