import { Badge } from '@chakra-ui/react';

import { BOUNDARY_STATUS } from '../../constants';

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

const BADGE_COLORS = {
    [BOUNDARY_STATUS.DRAFT]: 'gray',
    [BOUNDARY_STATUS.SUBMITTED]: 'teal',
    [BOUNDARY_STATUS.IN_REVIEW]: 'orange',
    [BOUNDARY_STATUS.NEEDS_REVISIONS]: 'orange',
    [BOUNDARY_STATUS.APPROVED]: 'green',
};

export function StatusBadge({ status }) {
    return (
        <Badge variant='solid' colorScheme={BADGE_COLORS[status]}>
            {status.toUpperCase()}
        </Badge>
    );
}
