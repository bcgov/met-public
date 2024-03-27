import React from 'react';
import { Chip } from '@mui/material';
import { Close } from '@mui/icons-material';

export const DeletableFilterChip = ({
    name,
    value,
    onDelete,
}: {
    name: string;
    value: string | number;
    onDelete?: () => void;
}) => {
    return (
        <Chip
            label={name}
            title={name}
            aria-label={name + ' filter - press to delete'}
            color="primary"
            // replicate the delete icon on the left-hand side
            icon={<Close fontSize="small" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }} />}
            variant="outlined"
            // enable deleting with backspace but hide the icon
            deleteIcon={<span />}
            onDelete={onDelete}
            // make clicking anywhere on the chip also delete it (larger touch target)
            onClick={onDelete}
            sx={{
                mt: '1px',
                mr: 1,
                mb: 2,
                p: 1,
                height: 48,
                fontWeight: 'normal',
                borderRadius: '2em',
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '14px',
            }}
        ></Chip>
    );
};
