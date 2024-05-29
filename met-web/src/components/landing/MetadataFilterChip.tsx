import React from 'react';
import { Chip, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-regular-svg-icons/faCheck';
import { useAppTranslation } from 'hooks';

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
    const { t: translate } = useAppTranslation();
    const selectionHint = translate(selected ? 'landing.filters.aria.selected' : 'landing.filters.aria.notSelected');
    return (
        <Chip
            size="medium"
            label={name}
            aria-label={translate('landing.filters.aria.metadataFilterChip')
                .replace('{0}', name)
                .replace('{1}', selectionHint)}
            color="default"
            avatar={selected ? <FontAwesomeIcon icon={faCheck} style={{ fontSize: '20px' }} /> : undefined}
            variant={selected ? 'filled' : 'outlined'}
            onClick={onClick}
            sx={{
                mr: 1,
                mb: 2,
                p: 1,
                height: '48px',
                fontWeight: selected ? 'bold' : 'normal',
                borderColor: selected ? '#053662' : '#D8EAFD',
                borderRadius: '2em',
                backgroundColor: selected ? '#D8EAFD' : 'transparent',
                color: selected ? theme.palette.primary.main : 'white',
                fontSize: '16px',
                '&.MuiChip-clickable:hover': {
                    backgroundColor: selected ? '#F1F8FE' : '#1E5189',
                },
                '&:focus': {
                    backgroundColor: selected ? '#F1F8FE' : '#1E5189',
                },
                '&:focus-visible': {
                    outline: 'white 2px dashed', // Remove default outline
                    outlineOffset: '2px',
                },
            }}
        />
    );
};
