import { Flex, Text } from '@chakra-ui/react';

export default function NotFound() {
    return (
        <Flex direction='column' bg='gray.50' h='100vh' alignItems='center'>
            <Text mt={24} textStyle='detail'>
                The requested page was not found.
            </Text>
        </Flex>
    );
}
