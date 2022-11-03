import { Fragment } from 'react';
import { Text } from '@chakra-ui/react';

import { formatDateTime } from '../../utils';
import { BOUNDARY_STATUS } from '../../constants';

export default function ActivityLog({ entries }) {
    const logEntriesAsTextElements = entries.map(
        ({ user, action, time, notes }, index) => {
            return (
                <Fragment key={index}>
                    <Text textStyle='submissionDetailHeading' mt={4}>
                        {formatDateTime(time)}
                    </Text>
                    <Text textStyle='smallDetail'>
                        {user}
                        {getActionString(action)}
                    </Text>
                    {notes ? (
                        <>
                            <Text textStyle='smallDetail' mt={1}>
                                Additional comment:
                            </Text>
                            <Text textStyle='activityLogNotes' mt={1}>
                                {notes}
                            </Text>
                        </>
                    ) : null}
                </Fragment>
            );
        }
    );

    return (
        <>
            <Text
                key='heading'
                mt={7}
                mb={2}
                textStyle='submissionDetailCategory'
            >
                Activity log
            </Text>
            {logEntriesAsTextElements}
        </>
    );
}

function getActionString(action) {
    switch (action) {
        case BOUNDARY_STATUS.DRAFT:
            return ' created a new draft.';
        case BOUNDARY_STATUS.SUBMITTED:
            return ' submitted a new map for review.';
        case BOUNDARY_STATUS.IN_REVIEW:
            return ' started a review.';
        case BOUNDARY_STATUS.NEEDS_REVISIONS:
            return ' requested revisions.';
        case BOUNDARY_STATUS.APPROVED:
            return ' approved this map.';
        case 'Unapproved':
            return ' unapproved this map.';

        default:
            throw new Error(`Invalid action type: ${action}`);
    }
}
