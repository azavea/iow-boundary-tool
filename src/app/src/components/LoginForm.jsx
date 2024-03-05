import { Box, VStack } from '@chakra-ui/react';

export default function LoginForm({ children }) {
    return (
        <VStack bg='gray.50' h='100vh' spacing={5}>
            <Box h='20%'></Box>
            {children}
        </VStack>
    );
}
