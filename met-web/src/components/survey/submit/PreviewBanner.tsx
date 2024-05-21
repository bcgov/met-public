import React, { useContext } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MetHeader1Old, SecondaryButtonOld } from 'components/common';
import { useAppSelector } from 'hooks';
import { ActionContext } from './ActionContext';
import { PermissionsGate } from 'components/permissionsGate';
import { USER_ROLES } from 'services/userService/constants';

export const PreviewBanner = () => {
    const navigate = useNavigate();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const { savedSurvey } = useContext(ActionContext);

    if (!isLoggedIn) {
        return null;
    }

    if (!savedSurvey) {
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
                    <MetHeader1Old sx={{ mb: 2 }}>Preview Survey</MetHeader1Old>
                </Grid>
                <Grid sx={{ pt: 2 }} item xs={12} container direction="row" justifyContent="flex-end" spacing={1}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-start">
                        <PermissionsGate scopes={[USER_ROLES.EDIT_ENGAGEMENT]} errorProps={{ disabled: true }}>
                            <SecondaryButtonOld
                                sx={{
                                    backgroundColor: 'background.paper',
                                    borderRadius: '4px',
                                }}
                                onClick={() => navigate(`/surveys/${savedSurvey.id}/build`)}
                            >
                                Edit Survey
                            </SecondaryButtonOld>
                        </PermissionsGate>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};
