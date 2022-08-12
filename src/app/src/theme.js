import { extendTheme } from '@chakra-ui/react';

const Button = {
    baseStyle: {
        fontFamily: `'Inter', sans-serif`,
        borderRadius: '4px',
        fontWeight: 600,
    },
    variants: {
        cta: {
            bg: 'gray.900',
            color: 'white',
            _hover: {
                bg: 'gray.600',
                textDecoration: 'underline',
            },
            _disabled: {
                bg: 'gray.400',
            },
        },
        primary: {
            bg: 'gray.100',
            color: 'gray.600',
            _hover: {
                bg: 'gray.600',
                textDecoration: 'underline',
                color: 'white',
            },
            _disabled: {
                bg: 'gray.400',
                color: 'white',
            },
        },
        secondary: {
            bg: 'white',
            borderWidth: '1px',
            borderColor: 'gray.200',
            color: 'gray.600',
            _hover: {
                bg: 'gray.200',
                textDecoration: 'underline',
            },
            _disabled: {
                color: 'gray.700',
            },
        },
        link: {
            fontWeight: 400,
            textDecoration: 'underline',
            color: 'gray.700',
        },
    },
};

const Heading = {
    variants: {
        preHeading: {
            color: 'gray.500',
            fontFamily: 'body',
            fontSize: 'md',
        },
    },
};

const theme = extendTheme({
    components: {
        Button,
        Heading,
    },
    fonts: {
        heading: `'Quicksand', sans-serif`,
        body: `'Quicksand', sans-serif`,
    },
    textStyles: {
        welcomeIntro: {
            fontFamily: 'heading',
            fontSize: 'xl',
        },
    },
    styles: {
        global: {
            'h1, h2, h3, h4, h5, h6': {
                letterSpacing: '-0.02em',
            },
        },
    },
});

export default theme;
