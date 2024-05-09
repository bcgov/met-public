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
        primary: {
            enabled: '#053662',
            hover: '#1E5189',
            focused: '#053662',
            pressed: '#032543',
            disabled: '#EDEBE9',
        },
        secondary: {
            enabled: '#FFFFFF',
            hover: '#EDEBE9',
            focused: '#FFFFFF',
            pressed: '#E0DEDC',
            disabled: '#EDEBE9',
            stroke: '#201F1E',
        },
        tertiary: {
            enabled: '#FFFFFF',
            hover: '#F1F8FF',
            focused: '#FFFFFF',
            pressed: '#F1F8FF',
            disabled: '#FFFFFF',
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
    },
};

export const elevations = {
    // For use with CSS box-shadow property
    // Not complete in Figma yet\
    none: '0px 0px transparent',
    z1: '0px 2px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 6px 0px rgba(0, 0, 0, 0.60) inset',
    z4: '0px 2px 3px 0px rgba(0, 0, 0, 0.10), 0px 6px 6px 0px rgba(0, 0, 0, 0.09), 0px 14px 9px 0px rgba(0, 0, 0, 0.05)',
    z9: '0px 5px 6px 0px rgba(0, 0, 0, 0.20), 0px 9px 12px 0px rgba(0, 0, 0, 0.14), 0px 3px 16px 0px rgba(0, 0, 0, 0.12)',
};

export const globalFocusShadow = `inset 0px 0px 0px 2px ${colors.focus.regular.inner}`;

export const globalFocusVisible = {
    '&:focus-visible': {
        outline: `2px solid ${colors.focus.regular.outer}`,
        boxShadow: globalFocusShadow,
    },
};
