import React, { Suspense } from 'react';
import { ResponsiveContainer } from 'components/common/Layout';
import { useFetcher, createSearchParams, useRouteLoaderData, Await, useAsyncValue, useNavigation } from 'react-router';
import { FormProvider, useForm } from 'react-hook-form';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';
import EngagementForm, { EngagementConfigurationData } from '.';
import { EngagementLoaderData } from 'components/engagement/public/view';
import { Engagement } from 'models/engagement';
import { ENGAGEMENT_MEMBERSHIP_STATUS, EngagementTeamMember } from 'models/engagementTeamMember';
import { BodyText, Header1, Header2 } from 'components/common/Typography';
import dayjs from 'dayjs';
import { Language } from 'models/language';
import { CircularProgress, Grid, Modal, Skeleton } from '@mui/material';
import { modalStyle } from 'components/common';

const EngagementConfigurationWizard = () => {
    const { engagement, teamMembers, slug } = useRouteLoaderData('single-engagement') as EngagementLoaderData;
    return (
        <ResponsiveContainer>
            <AutoBreadcrumbs />
            <Suspense
                fallback={
                    <Skeleton variant="text">
                        <Header1 sx={{ mb: 0 }}>Example Engagement</Header1>
                    </Skeleton>
                }
            >
                <Await resolve={engagement}>
                    {(resolvedEngagement) => <Header1 sx={{ mb: 0 }}>{resolvedEngagement.name}</Header1>}
                </Await>
            </Suspense>
            <br />
            <Suspense fallback={<Header2 decorated>Edit Configuration</Header2>}>
                <Await resolve={Promise.all([engagement, teamMembers, slug])}>
                    <ConfigForm />
                </Await>
            </Suspense>
        </ResponsiveContainer>
    );
};

const ConfigForm = () => {
    const [engagement, teamMembers, slug] = useAsyncValue() as [Engagement, EngagementTeamMember[], string];
    const fetcher = useFetcher();
    const navigation = useNavigation();

    const engagementConfigForm = useForm<EngagementConfigurationData>({
        defaultValues: {
            name: engagement.name,
            feedback_methods: [],
            start_date: dayjs(engagement.start_date),
            end_date: dayjs(engagement.end_date),
            _dateConfirmed: true,
            languages: [{ code: 'en', name: 'English' }] as Language[],
            is_internal: engagement.is_internal,
            _visibilityConfirmed: true,
            slug: slug,
            users: teamMembers.filter((tm) => tm.status == ENGAGEMENT_MEMBERSHIP_STATUS.Active).map((tm) => tm.user),
        },
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    });

    const onSubmit = async (data: EngagementConfigurationData) => {
        fetcher.submit(
            createSearchParams({
                name: data.name,
                feedback_methods: data.feedback_methods,
                start_date: data.start_date.format('YYYY-MM-DD'),
                end_date: data.end_date.format('YYYY-MM-DD'),
                languages: data.languages.map((l) => l.code),
                is_internal: data.is_internal ? 'true' : 'false',
                slug: data.slug,
                users: data.users.map((u) => u.external_id),
            }),
            {
                method: 'patch',
                action: `/engagements/${engagement.id}/details/config/edit`,
            },
        );
    };

    const {
        formState: { isSubmitting, isSubmitted },
    } = engagementConfigForm;

    return (
        <FormProvider {...engagementConfigForm}>
            <EngagementForm onSubmit={onSubmit} />
            <Modal
                open={
                    isSubmitting || isSubmitted || fetcher.state === 'submitting' || navigation.state === 'submitting'
                }
            >
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    sx={{ ...modalStyle, borderColor: 'notification.default.shade' }}
                >
                    <Grid item xs={1} sx={{ pt: 1.25, fontSize: '16px' }}>
                        <CircularProgress
                            variant="indeterminate"
                            sx={{
                                color: 'notification.default.shade',
                                width: '24px',
                                height: '24px',
                                animationDuration: '550ms',
                                '& .MuiCircularProgress-circle': {
                                    strokeLinecap: 'round',
                                },
                            }}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={11}
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="space-between"
                        rowSpacing={1}
                    >
                        <Grid container direction="row" item xs={12}>
                            <Grid xs={12}>
                                <Header2 sx={{ mb: 0 }}>We're saving your configuration.</Header2>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" item xs={12}>
                            <BodyText bold>This should only take a few seconds.</BodyText>
                        </Grid>
                    </Grid>
                </Grid>
            </Modal>
        </FormProvider>
    );
};

export default EngagementConfigurationWizard;
