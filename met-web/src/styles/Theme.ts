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
    text: {
        primary: '#494949',
    },
    action: {
        active: '#1A5A96',
    },
    info: {
        main: '#707070',
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
};

const MetBorderStyle = {
    border: '1px solid #cdcdcd',
    borderRadius: '5px',
    boxShadow: 'rgb(0 0 0 / 6%) 0px 2px 2px -1px, rgb(0 0 0 / 6%) 0px 1px 1px 0px, rgb(0 0 0 / 6%) 0px 1px 3px 0px',
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
        MuiTab: {
            styleOverrides: {
                root: {
                    ...MetBorderStyle,
                },
            },
        },
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
            styleOverrides: {
                root: {
                    ...MetBorderStyle,
                },
            },
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
