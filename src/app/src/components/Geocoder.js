import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Input, List, ListItem, ScaleFade } from '@chakra-ui/react';

import { getGeocodeSuggestUrl, getGeocodeUrl } from '../utils';
import { clearGeocodeResult, setGeocodeResult } from '../store/mapSlice';
import { usePreventMapDoubleClick } from '../hooks';

const GEOCODER_WIDTH = 320;

const decodeJson = response => response.json();

export default function Geocoder({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const ref = usePreventMapDoubleClick();
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (ref.current) {
                ref.current.focus();
            }
        } else {
            // Clear search text on close
            setInputValue('');
        }
    }, [isOpen, ref]);

    const updateSuggestions = search => {
        if (search.length > 0) {
            fetch(getGeocodeSuggestUrl(search))
                .then(decodeJson)
                .then(({ suggestions }) => setSuggestions(suggestions));
        } else {
            setSuggestions([]);
        }
    };

    const preventTabBlur = event => {
        if (event.key === 'Tab') {
            event.preventDefault();
        }
    };

    const nothingHighlighted = highlightIndex === -1;

    const keyUpHandler = ({ key }) => {
        switch (key) {
            case 'Down': // IE/Edge specific value
            case 'ArrowDown':
            case 'Tab':
                moveHighlightDown();
                break;

            case 'Up': // IE/Edge specific value
            case 'ArrowUp':
                moveHighlightUp();
                break;

            case 'Enter':
                doGeocode(
                    nothingHighlighted
                        ? { text: inputValue }
                        : suggestions[highlightIndex]
                );
                break;

            case 'Esc': // IE/Edge specific value
            case 'Escape':
                onClose();
                break;

            default:
                return;
        }
    };

    const moveHighlightDown = () => {
        setHighlightIndex(index => (isLastIndex(index) ? 0 : index + 1));
    };

    const isLastIndex = index => index === suggestions.length - 1;

    const moveHighlightUp = () => {
        setHighlightIndex(index => Math.max(0, index - 1));
    };

    const doGeocode = suggestion => {
        setInputValue(suggestion.text);
        setSuggestions([]);
        setLoading(true);

        fetch(getGeocodeUrl(suggestion))
            .then(decodeJson)
            .then(({ candidates }) => {
                setLoading(false);
                dispatch(setGeocodeResult(candidates));
            });
    };

    const clearResult = () => dispatch(clearGeocodeResult());

    const hasSuggestions = suggestions.length > 0;

    return (
        <ScaleFade in={isOpen} unmountOnExit>
            <Input
                position='relative'
                ref={ref}
                bg='white'
                focusBorderColor='gray.500'
                w={GEOCODER_WIDTH}
                value={inputValue}
                onChange={({ target: { value } }) => {
                    clearResult();
                    setHighlightIndex(-1);
                    updateSuggestions(value);
                    setInputValue(value);
                }}
                onKeyDown={preventTabBlur}
                onKeyUp={keyUpHandler}
                disabled={loading}
            />
            <ScaleFade in={hasSuggestions}>
                <List
                    position='absolute'
                    bg={hasSuggestions ? 'white' : undefined} // Fade is too slow
                    p={1}
                    mt={2}
                    borderRadius={5}
                    zIndex={1000}
                    w={GEOCODER_WIDTH}
                >
                    {suggestions.map((suggestion, index) => (
                        <ListItem
                            p={2}
                            key={suggestion.magicKey}
                            bg={
                                index === highlightIndex
                                    ? 'gray.200'
                                    : undefined
                            }
                            onMouseEnter={() => setHighlightIndex(index)}
                            cursor='pointer'
                            overflow='hidden'
                            whiteSpace='nowrap'
                            textOverflow='ellipsis'
                            fontSize='md'
                            onClick={() => doGeocode(suggestion)}
                        >
                            {suggestion.text}
                        </ListItem>
                    ))}
                </List>
            </ScaleFade>
        </ScaleFade>
    );
}
