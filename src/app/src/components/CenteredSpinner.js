import { Box, Flex, Spinner } from '@chakra-ui/react';

export default function CenteredSpinner() {
    return (
        <Box w='100%' h='100vh'>
            <Flex direction='column' alignItems='center'>
                <Spinner mt={60} />
            </Flex>
        </Box>
    );
}
