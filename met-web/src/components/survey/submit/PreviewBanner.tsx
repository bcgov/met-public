import React, { Suspense } from 'react';
import { Box, Grid, Skeleton, Stack } from '@mui/material';
import { useNavigate, Await, useRouteLoaderData } from 'react-router';
import { useAppSelector } from 'hooks';
import { PermissionsGate } from 'components/permissionsGate';
import { USER_ROLES } from 'services/userService/constants';
import { Header1 } from 'components/common/Typography';
import { Button } from 'components/common/Input';
import { Survey } from 'models/survey';
import { SurveyLoaderData } from '../building/SurveyLoader';

const Banner = (survey: Survey) => {
    const navigate = useNavigate();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    if (!isLoggedIn || !survey) {
        return null;
    }
    return (
        <Box sx={{ backgroundColor: 'secondary.light' }}>
            <Grid container direction="row" justifyContent="flex-end" alignItems="flex-start" padding={4}>
                <Grid item xs={12}>
                    <Header1 sx={{ mb: 2 }}>Preview Survey</Header1>
                </Grid>
                <Grid sx={{ pt: 2 }} item xs={12} container direction="row">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-start">
                        <PermissionsGate scopes={[USER_ROLES.EDIT_ENGAGEMENT]} errorProps={{ disabled: true }}>
                            <Button variant="secondary" onClick={() => navigate(`/surveys/${survey.id}/build`)}>
                                Edit Survey
                            </Button>
                        </PermissionsGate>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export const PreviewBanner = () => {
    const { survey } = useRouteLoaderData('survey') as SurveyLoaderData;

    return (
        <Suspense fallback={<Skeleton variant="rectangular" height="10em" width="100%" />}>
            <Await resolve={survey}>{Banner}</Await>
        </Suspense>
    );
};
