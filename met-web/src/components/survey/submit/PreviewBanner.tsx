import React from 'react';
import { Box, Grid, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MetHeader1, SecondaryButton } from 'components/common';
import { useAppSelector } from 'hooks';

export const PreviewBanner = () => {
    const navigate = useNavigate();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <Box
            sx={{
                backgroundColor: 'secondary.light',
            }}
        >
            <Grid container direction="row" justifyContent="flex-end" alignItems="flex-start" padding={4}>
                <Grid item xs={12}>
                    <MetHeader1 sx={{ mb: 2 }}>Preview Survey</MetHeader1>
                </Grid>
                <Grid sx={{ pt: 2 }} item xs={12} container direction="row" justifyContent="flex-end" spacing={1}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-start">
                        <SecondaryButton
                            sx={{
                                backgroundColor: 'background.paper',
                                borderRadius: '4px',
                            }}
                            onClick={() => navigate('/surveys')}
                        >
                            Close Preview
                        </SecondaryButton>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};
