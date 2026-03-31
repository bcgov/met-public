import React from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudCheck } from '@fortawesome/pro-regular-svg-icons/faCloudCheck';

const FORMIO_MODAL_Z_INDEX = 10000;
export const AutoSaveSnackBar = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            autoHideDuration={2500}
            onClose={handleClose}
            sx={{
                zIndex: FORMIO_MODAL_Z_INDEX + 1,
            }}
        >
            <Alert
                data-testid="alert-notification"
                severity={'success'}
                sx={{ width: '100%' }}
                onClose={handleClose}
                icon={<FontAwesomeIcon icon={faCloudCheck} style={{ fontSize: '20px', padding: '2px' }} />}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    Autosaved!
                </Stack>
            </Alert>
        </Snackbar>
    );
};
