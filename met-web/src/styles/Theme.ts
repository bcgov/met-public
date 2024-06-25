import { PaletteMode, createTheme } from '@mui/material';
export const colors = {
    type: {
        regular: {
            primary: '#292929',
            secondary: '#464341',
            link: '#1A5A96',
            disabled: '#A19F9D',
        },
        inverted: {
            primary: '#FFFFFF',
            secondary: '#EDEBE9',
            link: '#D8EBFF',
            disabled: '#A19F9D',
        },
    },
    button: {
        default: {
            shade: '#12508F',
            icon: '#12508F',
            tint: '#FFF8E8',
        },
        success: {
            shade: '#42814A',
            icon: '#42814A',
            tint: '#F6FFF8',
        },
        warning: {
            shade: '#FCBA19',
            icon: '#C08C07',
            tint: '#FFECBE',
        },
        danger: {
            shade: '#CE3E39',
            icon: '#CE3E39',
            tint: '#F4E1E2',
        },
        error: {
            shade: '#CE3E39',
            icon: '#CE3E39',
            tint: '#F4E1E2',
        },
    },
    focus: {
        regular: {
            outer: '#2E5DD7',
            inner: '#FFFFFF',
        },
    },
    surface: {
        gray: {
            10: '#FAF9F8',
            20: '#F3F2F1',
            30: '#EDEBE9',
            40: '#E1DFDD',
            50: '#D2D0CE',
            60: '#C8C6C4',
            70: '#A19F9D',
            80: '#7A7876',
            90: '#3B3A39',
            100: '#323130',
            110: '#201F1E',
        },
        blue: {
            10: '#F1F8FF',
            20: '#D8EBFF',
            30: '#C0DFFF',
            40: '#A7D2FF',
            50: '#8EC6FF',
            60: '#76BAFF',
            70: '#4E97E0',
            80: '#2B71B8',
            90: '#12508F',
            100: '#053662',
            bc: '#053662',
        },
        gold: {
            10: '#FFF8E8',
            20: '#FFECBE',
            30: '#FFE095',
            40: '#FFD46C',
            50: '#FFC843',
            60: '#FCBA19',
            bc: '#FCBA19',
            70: '#D39706',
            80: '#AA7900',
            90: '#825C00',
            100: '#593F00',
        },
        white: '#FFFFFF',
    },
    notification: {
        default: {
            shade: '#12508F',
            icon: '#12508F',
            tint: '#FFF8E8',
        },
        success: {
            shade: '#42814A',
            icon: '#42814A',
            tint: '#F6FFF8',
        },
        warning: {
            shade: '#FCBA19',
            icon: '#C08C07',
            tint: '#FFECBE',
        },
        danger: {
            shade: '#CE3E39',
            icon: '#CE3E39',
            tint: '#F4E1E2',
        },
        error: {
            shade: '#CE3E39',
            icon: '#CE3E39',
            tint: '#F4E1E2',
        },
    },
};

export const Palette = {
    primary: {
        main: colors.surface.blue[100],
        light: colors.surface.blue[90],
        dark: colors.surface.blue[100],
    },
    secondary: {
        main: colors.surface.gold.bc,
        light: colors.surface.gold[50],
        dark: colors.surface.gold[70],
    },
    background: {
        default: colors.surface.white,
        paper: colors.surface.white,
    },
    hover: {
        light: colors.surface.blue[90],
    },
    text: {
        primary: colors.type.regular.primary,
    },
    action: {
        active: colors.type.regular.link,
    },
    info: {
        main: colors.surface.gray[90],
    },
    internalHeader: {
        backgroundColor: colors.surface.white,
        color: colors.type.regular.primary,
    },
    publicHeader: {
        backgroundColor: colors.surface.white,
        color: colors.type.regular.primary,
    },
    dashboard: {
        upcoming: {
            bg: colors.notification.warning.tint,
            border: colors.notification.warning.shade,
        },
        open: {
            bg: colors.notification.success.tint,
            border: colors.notification.success.shade,
        },
        closed: {
            bg: colors.notification.danger.tint,
            border: colors.notification.danger.shade,
        },
    },
    icons: {
        surveyReady: colors.notification.success.shade,
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
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: Palette.background.paper,
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
        MuiSkeleton: {
            defaultProps: {
                animation: 'wave',
            },
        },
    },
    typography: {
        fontFamily: "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif",
        fontSize: 16,
        allVariants: {
            color: Palette.text.primary,
        },
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
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

export const DarkPalette = {
    mode: 'dark' as PaletteMode,
    primary: {
        main: colors.surface.white,
        light: colors.surface.blue[10],
        dark: colors.surface.blue[20],
    },
    secondary: {
        main: colors.surface.gold.bc,
        light: colors.surface.gold[50],
        dark: colors.surface.gold[70],
    },
    background: {
        default: colors.surface.blue[90],
        paper: colors.surface.gray[110],
    },
    hover: {
        light: colors.surface.blue[10],
    },
    text: {
        primary: colors.type.inverted.primary,
    },
    action: {
        active: colors.type.inverted.link,
    },
    info: {
        main: colors.surface.gray[20],
    },
};

export const DarkTheme = createTheme({
    palette: DarkPalette,
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.surface.gray[110],
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
            defaultProps: {
                size: 'small',
            },
        },
        MuiLink: {
            defaultProps: {
                color: DarkPalette.action.active,
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
        MuiSkeleton: {
            defaultProps: {
                animation: 'wave',
            },
            styleOverrides: {
                root: {
                    backgroundColor: colors.surface.blue[90],
                },
                wave: {
                    backgroundColor: colors.surface.blue[80],
                },
            },
        },
    },
    typography: {
        fontFamily: "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif",
        fontSize: 16,
        allVariants: {
            color: colors.type.inverted.primary,
        },
        h2: {
            fontWeight: 300,
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: '1.15rem',
        },
        body1: {
            fontSize: '16px',
        },
        button: {
            fontWeight: 400,
            fontSize: '1.125rem',
            textTransform: 'none',
        },
    },
});

export const ZIndex = {
    footer: BaseTheme.zIndex.drawer + 1,
};
