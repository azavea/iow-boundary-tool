import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Text,
} from '@chakra-ui/react';
import {
    QuestionMarkCircleIcon as HelpIcon,
    PlusIcon,
} from '@heroicons/react/outline';

import {
    useBoundaryId,
    useEndpointToastError,
    useFilePicker,
} from '../../hooks';
import {
    useDebouncedUpdateReferenceImageMutation,
    useUploadReferenceImageMutation,
} from '../../api/referenceImages';
import { useDrawBoundary, useDrawPermissions } from '../DrawContext';

import VisibilityButton from './VisbilityButton';

import { ACCEPT_IMAGES } from '../../constants';
import { paddingLeft } from './style';

export default function ReferenceLayers() {
    const boundaryId = useBoundaryId();
    const boundary = useDrawBoundary();
    const { canWrite } = useDrawPermissions();

    const [createReferenceImage, { createReferenceImageError }] =
        useUploadReferenceImageMutation();

    const [updateReferenceImage, { updateReferenceImageError }] =
        useDebouncedUpdateReferenceImageMutation(boundaryId, canWrite);

    useEndpointToastError(
        createReferenceImageError ?? updateReferenceImageError
    );

    const uploadImage = file => {
        createReferenceImage({
            boundaryId,
            filename: file.name,
            is_visible: true,
            distortion: null,
            opacity: 100,
            file,
        });
    };

    const openFileDialog = useFilePicker({
        onChange: files => files.map(uploadImage),
        multiple: true,
        accept: ACCEPT_IMAGES,
    });

    return (
        <Box ml={paddingLeft} mt={6} mb={6}>
            <Flex mb={4} align='center'>
                <Heading variant='sidebar' size='sm'>
                    Reference Layers
                </Heading>
                <Icon color='white' as={HelpIcon} ml={2} />
            </Flex>
            <Button
                bg='gray.500'
                color='white'
                variant='button'
                leftIcon={<Icon as={PlusIcon} />}
                mb={4}
                onClick={openFileDialog}
                disabled={!canWrite}
            >
                Upload file
            </Button>
            <Flex direction='column' align='flex-start'>
                {boundary.reference_images.map(image => (
                    <Box key={image.id} w='100%'>
                        <VisibilityButton
                            visible={image.is_visible}
                            onChange={() => {
                                updateReferenceImage({
                                    ...image,
                                    is_visible: !image.is_visible,
                                });
                            }}
                            label={image.filename}
                        />
                        {image.is_visible && (
                            <OpacitySlider
                                value={image.opacity}
                                onChange={opacity => {
                                    updateReferenceImage({ ...image, opacity });
                                }}
                            />
                        )}
                    </Box>
                ))}
            </Flex>
        </Box>
    );
}

function OpacitySlider({ value: defaultValue, onChange }) {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    return (
        <Flex w='100%' mb={1}>
            <Slider
                min={0}
                max={100}
                step={1}
                defaultValue={value}
                onChange={setValue}
                onChangeEnd={onChange}
                flexGrow={1}
            >
                <SliderTrack bg='white'>
                    <SliderFilledTrack bg='gray.500' />
                </SliderTrack>
                <SliderThumb border='1px solid var(--chakra-colors-gray-300);' />
            </Slider>
            <Text
                color='gray.50'
                style={{
                    fontWeight: 400,
                    fontSize: '16px',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                }}
            >
                {value}%
            </Text>
        </Flex>
    );
}
