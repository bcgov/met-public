import React from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';

export const AutoSaveSnackBar = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={open}
            autoHideDuration={1000}
            onClose={handleClose}
        >
            <Alert
                data-testid="alert-notification"
                severity={'success'}
                sx={{ width: '100%' }}
                onClose={handleClose}
                icon={<PublishedWithChangesIcon />}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    Autosaved!
                </Stack>
            </Alert>
        </Snackbar>
    );
};
