import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';

export default function Login() {
    return (
        <VStack bg='gray.50' h='100vh' spacing={5}>
            <Box h='20%'></Box>
            <Text textStyle='loginHeader'>Boundary Sync</Text>
            <Box />
            <Input htmlSize={32} width='auto' bg='white' placeholder='email' />
            <Input
                htmlSize={32}
                width='auto'
                bg='white'
                type='password'
                placeholder='password'
            />
            <VStack spacing={2}>
                <Button w='320px' variant='cta'>
                    Login
                </Button>
                <Button variant='minimal'>Forgot password?</Button>
            </VStack>
        </VStack>
    );
}
