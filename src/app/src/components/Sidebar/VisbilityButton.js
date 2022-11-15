import { Button, Icon, Circle, Tooltip } from '@chakra-ui/react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

import { SIDEBAR_TEXT_TOOLTIP_THRESHOLD } from '../../constants';

export default function VisibilityButton({
    label,
    visible,
    onChange,
    disabled = false,
}) {
    return (
        <Tooltip
            label={label}
            bg='gray.500'
            hasArrow
            isDisabled={label?.length <= SIDEBAR_TEXT_TOOLTIP_THRESHOLD}
        >
            <Button
                mb={1}
                leftIcon={
                    <Circle
                        color='white'
                        bg={visible ? 'gray.500' : 'gray.600'}
                        mr={2}
                    >
                        <Icon
                            as={visible ? EyeIcon : EyeOffIcon}
                            m={2}
                            fontSize='lg'
                            strokeWidth={1}
                        />
                    </Circle>
                }
                onClick={onChange}
                variant='link'
                color={visible ? 'gray.300' : 'gray.500'}
                textDecoration='none'
                fontWeight={600}
                disabled={disabled}
            >
                {label}
            </Button>
        </Tooltip>
    );
}
