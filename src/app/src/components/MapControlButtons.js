import { Box, Icon, IconButton, VStack } from '@chakra-ui/react';

import { SearchIcon, PlusIcon, MinusIcon } from '@heroicons/react/outline';

export default function MapControlButtons() {
    return (
        <Box
            position='absolute'
            top='30px'
            right='32px'
            zIndex={1000}
            flexDirection='column'
        >
            <VStack direction='column' spacing='6px'>
                <MapControlButton icon={SearchIcon} />
                <MapControlButton icon={PlusIcon} />
                <MapControlButton icon={MinusIcon} />
            </VStack>
        </Box>
    );
}

function MapControlButton({ icon, onClick }) {
    return (
        <IconButton
            onClick={onClick}
            variant='toolbar'
            icon={<Icon as={icon} fontSize='xl' strokeWidth={1} />}
        />
    );
}
