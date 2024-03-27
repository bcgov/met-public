import React from 'react';
import { Chip, useTheme } from '@mui/material';
import { Check } from '@mui/icons-material';

export const MetadataFilterChip = ({
    name,
    selected,
    onClick,
}: {
    name: string;
    selected?: boolean;
    onClick?: () => void;
}) => {
    const theme = useTheme();
    return (
        <Chip
            size="medium"
            label={name}
            color="default"
            avatar={selected ? <Check /> : undefined}
            variant={selected ? 'filled' : 'outlined'}
            onClick={onClick}
            sx={{
                mr: 1,
                mb: 2,
                p: 1,
                height: '48px',
                fontWeight: selected ? 'bold' : 'normal',
                borderColor: selected
                    ? 'var(--surface-color-brand-blue-100, #053662)'
                    : 'var(--surface-color-brand-blue-20, #D8EAFD)',
                borderRadius: '2em',
                backgroundColor: selected ? 'var(--surface-color-brand-blue-20, #D8EAFD)' : 'transparent',
                color: selected ? theme.palette.primary.main : 'white',
                fontSize: '16px',
                '&.MuiChip-clickable:hover': {
                    backgroundColor: selected
                        ? 'var(--surface-color-brand-blue-10, #F1F8FE)'
                        : 'var(--surface-color-brand-blue-90, #1E5189)',
                },
                '&:focus': {
                    backgroundColor: selected
                        ? 'var(--surface-color-brand-blue-10, #F1F8FE)'
                        : 'var(--surface-color-brand-blue-90, #1E5189)',
                },
            }}
        />
    );
};
