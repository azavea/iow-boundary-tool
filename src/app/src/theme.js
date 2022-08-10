import { extendTheme } from '@chakra-ui/react';

const Button = {
    variants: {
        link: {
            fontFamily: `'Inter', sans-serif`,
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
