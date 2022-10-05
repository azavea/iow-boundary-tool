import { Grid, GridItem, Text } from '@chakra-ui/react';

export default function DataGrid({ initialMarginTop, title, data }) {
    return (
        <>
            <Text mt={initialMarginTop} textStyle='submissionDetailCategory'>
                {title}
            </Text>
            <Grid templateColumns='repeat(2, 1fr)' gap={2}>
                {Object.entries(data).map(([label, entry]) => {
                    return (
                        <GridItem key={label}>
                            <Text mt={4} textStyle='submissionDetailHeading'>
                                {label}
                            </Text>
                            {/* if not a string, accept a React element */}
                            {entry instanceof String ? (
                                <Text mt={1} textStyle='submissionDetailBody'>
                                    {entry}
                                </Text>
                            ) : (
                                entry
                            )}
                        </GridItem>
                    );
                })}
            </Grid>
        </>
    );
}
