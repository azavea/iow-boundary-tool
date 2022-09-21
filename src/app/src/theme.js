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
        toolbar: {
            bg: 'white',
            borderRadius: '6px',
            strokeWidth: '1px',
            _hover: {
                bg: 'gray.100',
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
        minimal: {
            fontWeight: 400,
            fontSize: 'sm',
            textDecoration: 'underline',
            color: 'gray.800',
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
        sidebar: {
            color: 'white',
            fontFamily: `'Inter', sans-serif`,
            size: 'md',
        },
    },
};

const Input = {
    baseStyle: {
        fontFamily: `'Inter', san-serif`,
    },
};

const ListItem = {
    baseStyle: {
        fontFamily: `'Inter', san-serif`,
    },
};

const Tooltip = {
    baseStyle: {
        fontFamily: `'Inter', sans-serif`,
        fontWeight: 600,
        color: 'white',
    },
};

const theme = extendTheme({
    components: {
        Button,
        Heading,
        Input,
        ListItem,
        Tooltip,
    },
    fonts: {
        heading: `'Quicksand', sans-serif`,
        body: `'Inter', sans-serif`,
    },
    textStyles: {
        welcomeIntro: {
            fontFamily: 'heading',
            fontSize: 'xl',
        },
        loginHeader: {
            fontFamily: 'heading',
            fontSize: '3xl',
            fontWeight: 'bold',
            alignItems: 'center',
            bg: 'gray.50',
        },
        loginError: {
            fontSize: 'md',
            alignItems: 'center',
            color: 'red.600',
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
