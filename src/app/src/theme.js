import { extendTheme } from '@chakra-ui/react';

const Button = {
    variants: {
        link: {
            fontFamily: `'Inter', sans-serif`,
        },
    },
};

const theme = extendTheme({
    components: {
        Button,
    },
    fonts: {
        heading: `'Quicksand', sans-serif`,
        body: `'Quicksand', sans-serif`,
    },
});

export default theme;
