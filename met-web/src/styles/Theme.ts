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
    info: {
        main: '#404040',
        dark: '#404040',
        light: '#404040',
    },
    text: {
        primary: '#494949',
    },
    action: {
        active: '#1A5A96',
    },
    widgets: {
        default: '#404040',
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
        info: {
            main: Palette.info.main,
        },
        text: {
            primary: Palette.text.primary,
        },
        action: {
            active: Palette.action.active,
        },
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableRipple: true,
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
        MuiIconButton: {
            defaultProps: {
                color: 'info',
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
            fontSize: '1.2rem',
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
