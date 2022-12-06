import {
    Flex,
    Heading,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spacer,
} from '@chakra-ui/react';

export default function ModalSection({
    preHeading,
    heading,
    nextButton,
    prevButton,
    children,
}) {
    return (
        <ModalContent minH='65vh' p={8}>
            <ModalHeader>
                {preHeading && (
                    <Heading variant='preHeading'>{preHeading}</Heading>
                )}
                <Heading size='lg'>{heading}</Heading>
            </ModalHeader>

            <ModalBody>{children}</ModalBody>

            <ModalFooter mt={4}>
                <Flex w='100%'>
                    {prevButton}
                    <Spacer />
                    {nextButton}
                </Flex>
            </ModalFooter>
        </ModalContent>
    );
}
