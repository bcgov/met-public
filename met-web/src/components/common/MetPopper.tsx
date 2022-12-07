import { Box, Popper, Theme } from '@mui/material';
import { styled } from '@mui/system';

export const metPopperClasses = {
    arrow: 'met-popper-arrow',
};

export const Arrow = styled(Box)(() => ({
    overflow: 'hidden',
    position: 'absolute',
    width: '1em',
    height: '0.71em' /* = width / sqrt(2) = (length of the hypotenuse) */,
    boxSizing: 'border-box',
    color: '#9BE2DF',
    '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: '100%',
        height: '100%',
        backgroundColor: 'currentColor',
        transform: 'rotate(45deg)',
    },
}));

Arrow.defaultProps = {
    ...Arrow.defaultProps,
    className: metPopperClasses.arrow,
    component: 'span',
};

export const PopperArrow = styled(Popper)(({ theme }: { theme?: Theme }) => ({
    zIndex: theme?.zIndex?.tooltip || 1500,
    [`&[data-popper-placement*="bottom"] .${metPopperClasses.arrow}`]: {
        top: 0,
        left: 0,
        marginTop: '-0.71em',
        '&::before': {
            transformOrigin: '0 100%',
        },
    },
    [`&[data-popper-placement*="top"] .${metPopperClasses.arrow}`]: {
        bottom: 0,
        left: 0,
        marginBottom: '-0.71em',
        '&::before': {
            transformOrigin: '100% 0',
        },
    },
    [`&[data-popper-placement*="right"] .${metPopperClasses.arrow}`]: {
        left: 0,
        marginLeft: '-0.71em',
        height: '1em',
        width: '0.71em',
        '&::before': {
            transformOrigin: '100% 100%',
        },
    },
    [`&[data-popper-placement*="left"] .${metPopperClasses.arrow}`]: {
        right: 0,
        marginRight: '-0.71em',
        height: '1em',
        width: '0.71em',
        '&::before': {
            transformOrigin: '0 0',
        },
    },
}));
