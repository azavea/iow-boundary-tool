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
        annotationLink: props => ({
            ...theme.components.Button.variants.link(props),
            fontFamily: `'Inter', sans-serif`,
            color: 'white',
            fontWeight: 600,
            fontSize: 12,
            lineHeight: 14,
            textDecoration: 'none',
            _hover: {
                textDecoration: 'underline',
            },
        }),
        minimal: {
            fontWeight: 400,
            fontSize: 'sm',
            textDecoration: 'underline',
            color: 'gray.800',
        },
        mapButton: {
            color: 'gray.600',
            bg: 'white',
            border: '1px solid',
            borderColor: 'gray.200',
            borderRadius: '4px',
        },
    },
};

const Badge = {
    variants: {
        submissionDetail: props => ({
            ...theme.components.Badge.variants.solid(props),
            height: '18px',
            marginTop: 2,
        }),
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

const Table = {
    variants: {
        submissions: {
            table: {
                borderColor: 'gray.200',
                borderWidth: '1px',
            },
            th: {
                bg: 'gray.50',
            },
            tr: {
                borderColor: 'gray.200',
                borderWidth: '1px',
            },
        },
    },
};

const theme = extendTheme({
    components: {
        Badge,
        Button,
        Heading,
        Input,
        ListItem,
        Tooltip,
        Table,
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
        apiError: {
            fontSize: 'md',
            alignItems: 'center',
            color: 'red.600',
        },
        utilityEntry: {
            fontSize: 'sm',
            fontWeight: 700,
        },
        utilityId: {
            fontSize: 'sm',
            fontWeight: 400,
            color: 'gray.500',
        },
        timestamp: {
            fontSize: 'sm',
            fontWeight: 400,
        },
        tableHeading: {
            fontSize: 'sm',
            fontWeight: 700,
            fontFamily: `'Inter', sans-serif`,
            textTransform: 'none',
        },
        submissionDetailCategory: {
            fontWeight: 600,
            fontSize: '18px',
            color: 'gray.700',
        },
        submissionDetailHeading: {
            fontWeight: 600,
            fontSize: '14px',
            color: 'gray.500',
        },
        detail: {
            fontWeight: 400,
            fontSize: '16px',
            color: 'gray.700',
        },
        smallDetail: {
            fontWeight: 400,
            fontSize: '14px',
            color: 'gray.700',
        },
        modalDetail: {
            fontWeight: 400,
            fontSize: '20px',
            color: 'gray.700',
        },
        selectedUtility: {
            fontFamily: `'Inter', sans-serif`,
            fontWeight: 400,
            fontSize: '20px',
            color: 'white',
        },
        utilitySelectLabel: {
            fontFamily: `'Inter', sans-serif`,
            fontSize: '16px',
            fontWeight: 600,
        },
        activityLogNotes: {
            fontFamily: `'Inter', sans-serif`,
            fontStyle: 'italic',
            fontSize: '14px',
            fontWeight: 400,
            color: 'gray.700',
            borderLeft: '.25rem solid var(--chakra-colors-gray-200)',
            maxWidth: '50%',
            paddingLeft: '.5rem',
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
