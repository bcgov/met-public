import { createTheme } from '@mui/material';

export const Palette = {
    primary: {
        main: '#003366',
        light: '#385989',
        dark: '#000C3B',
    },
    secondary: {
        main: '#FFC107',
        dark: '#FFAB00',
        light: '#FFE082',
    },
    hover: {
        light: 'var(--bcds-surface-primary-hover)',
    },
    text: {
        primary: '#494949',
    },
    action: {
        active: '#1A5A96',
    },
    info: {
        main: '#707070',
    },
    internalHeader: {
        backgroundColor: 'var(--bcds-surface-background-white)',
        color: '#292929',
    },
    publicHeader: {
        backgroundColor: 'var(--bcds-surface-background-white)',
        color: '#292929',
    },
    dashboard: {
        upcoming: {
            bg: '#FCB92F26',
            border: '#FCB92F',
        },
        open: {
            bg: '#C8DF8C4D',
            border: '#839537',
        },
        closed: {
            bg: '#F15A2C1A',
            border: '#F15A2C',
        },
    },
    icons: {
        surveyReady: '#77EB52',
    },
};

export const BaseTheme = createTheme({
    palette: {
        primary: {
            main: Palette.primary.main,
            light: Palette.primary.light,
            dark: Palette.primary.dark,
        },
        secondary: {
            main: Palette.secondary.main,
            dark: Palette.secondary.dark,
            light: Palette.secondary.light,
        },
        text: {
            primary: Palette.text.primary,
        },
        action: {
            active: Palette.action.active,
        },
        info: {
            main: Palette.info.main,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    height: '40px',
                },
            },
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiLink: {
            defaultProps: {
                color: Palette.action.active,
            },
        },
        MuiFormLabel: {
            defaultProps: {
                focused: false,
            },
        },
        MuiStepLabel: {
            styleOverrides: {
                label: {
                    color: '#494949 !important',
                    opacity: '100% !important',
                },
                labelContainer: {
                    color: '#494949 !important',
                    opacity: '100% !important',
                },
            },
        },
    },
    typography: {
        fontFamily: "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif",
        fontSize: 16,
        h1: {
            fontWeight: 500,
        },
        h2: {
            fontWeight: 500,
        },
        h3: {
            fontWeight: 500,
        },
        h4: {
            fontWeight: 500,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: '1.15rem',
        },
        body1: {
            fontWeight: 500,
            fontSize: '16px',
        },
        button: {
            fontWeight: 700,
            fontSize: '1.125rem',
            textTransform: 'none',
        },
    },
});

export const PublicTheme = createTheme(BaseTheme, {
    palette: {
        primary: {
            main: '#CFD8DC',
            dark: '#455A64',
            light: '#ECF2F5',
        },
        text: {
            primary: Palette.text.primary,
        },
        action: {
            active: Palette.action.active,
        },
    },
});

export const ZIndex = {
    footer: BaseTheme.zIndex.drawer + 1,
};
