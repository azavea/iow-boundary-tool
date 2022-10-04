import { Fragment } from 'react';
import { Text } from '@chakra-ui/react';

export default function ActivityLog({ submissionId }) {
    const fetchLogEntries = () => {
        return [
            [
                'July 7, 2022 | 3:30 pm',
                'Jenny Smith has submitted a new map for review',
            ],
        ];
    };

    const logEntries = fetchLogEntries();

    const logEntriesAsTextElements = logEntries.map((entry, index) => {
        const [timestamp, description] = entry;
        return (
            <Fragment key={index}>
                <Text textStyle='submissionDetailHeading'>{timestamp}</Text>
                <Text mt={2}>{description}</Text>
            </Fragment>
        );
    });

    return (
        <>
            <Text key='heading' mt={7} textStyle='submissionDetailCategory'>
                Activity log
            </Text>
            {logEntriesAsTextElements}
        </>
    );
}
