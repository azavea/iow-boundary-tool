import { Badge } from '@chakra-ui/react';

import { BOUNDARY_STATUS } from '../../constants';

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
