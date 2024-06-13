import React from 'react';
import { Pagination as MuiPagination, PaginationItem, PaginationProps } from '@mui/material';
import { styled } from '@mui/system';
import { colors, elevations, globalFocusShadow } from '../../common';

const PrimaryButtonStyles = {
    boxShadow: elevations.default,
    backgroundColor: colors.button.default.shade,
    color: colors.type.inverted.primary,
    '&:focus': {
        backgroundColor: `color-mix(in srgb, ${colors.button.default.shade}, black 20%)`,
        boxShadow: elevations.hover,
    },
    '&:focus-visible': {
        backgroundColor: `color-mix(in srgb, ${colors.button.default.shade}, black 20%)`,
        outline: `2px solid ${colors.focus.regular.outer}`,
        boxShadow: [globalFocusShadow, elevations.hover].join(','),
    },
    '&:hover': {
        backgroundColor: `color-mix(in srgb, ${colors.button.default.shade}, black 20%)`,
        boxShadow: elevations.hover,
        '&:focus-visible': {
            boxShadow: [globalFocusShadow, elevations.hover].join(','),
        },
    },
    '&:active': {
        backgroundColor: `color-mix(in srgb, ${colors.button.default.shade}, black 20%)`,
        boxShadow: elevations.pressed,
        '&:focus-visible': {
            boxShadow: [globalFocusShadow, elevations.pressed].join(','),
        },
    },
    '&:disabled': {
        backgroundColor: '#EDEBE9',
        boxShadow: 'none',
        color: colors.type.regular.disabled,
    },
};

const SecondaryButtonStyles = {
    backgroundColor: 'white',
    color: colors.type.regular.primary,
    '&:focus': {
        backgroundColor: '#F8F8F8',
        boxShadow: elevations.hover,
        color: colors.type.inverted,
        border: 'none',
    },
    '&:focus-visible': {
        backgroundColor: '#F8F8F8',
        outline: `2px solid ${colors.focus.regular.outer}`,
        boxShadow: [globalFocusShadow, elevations.hover].join(','),
        color: colors.type.inverted,
        border: 'none',
    },
    '&:hover': {
        backgroundColor: '#F8F8F8',
        boxShadow: elevations.hover,
        color: colors.type.inverted,
        border: 'none',
        '&:focus-visible': {
            boxShadow: [globalFocusShadow, elevations.hover].join(','),
        },
    },
    '&:active': {
        backgroundColor: '#F8F8F8',
        boxShadow: elevations.pressed,
        color: colors.type.inverted,
        border: `2px solid ${colors.surface.gray[110]}`,
        '&:focus-visible': {
            boxShadow: [globalFocusShadow, elevations.pressed].join(','),
        },
    },
    '&:disabled': {
        backgroundColor: 'white',
        boxShadow: 'none',
        color: colors.type.regular.disabled,
    },
};

const CustomPaginationItem = styled(PaginationItem)(({ selected }) => ({
    ...(selected ? PrimaryButtonStyles : SecondaryButtonStyles),
}));

export const Pagination: React.FC<PaginationProps> = (props) => {
    return <MuiPagination {...props} renderItem={(item) => <CustomPaginationItem {...item} />} />;
};
