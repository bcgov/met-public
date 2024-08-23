import React from 'react';
import { ResponsiveContainer } from 'components/common/Layout';
import { useFetcher, createSearchParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';
import EngagementForm, { EngagementConfigurationData } from '.';
import { Header1, Header2 } from 'components/common/Typography';
import { SystemMessage } from 'components/common/Layout/SystemMessage';
import { Link } from 'components/common/Navigation';

const EngagementCreationWizard = () => {
    const fetcher = useFetcher();

    const engagementCreationForm = useForm<EngagementConfigurationData>({
        defaultValues: {
            name: '',
            feedback_methods: [],
            start_date: undefined,
            end_date: undefined,
            _dateConfirmed: true,
            languages: [],
            is_internal: undefined,
            _visibilityConfirmed: false,
            slug: '',
            users: [],
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
                method: 'post',
                action: '/engagements/create/',
            },
        );
    };

    return (
        <ResponsiveContainer>
            <AutoBreadcrumbs />
            <Header1 sx={{ mb: 0 }}>New Engagement</Header1>
            <Header2 weight="thin">Create a new engagement in six easy configuration steps.</Header2>
            <SystemMessage status="info">
                You will be able to modify the configuration of your engagement later in the case the parameters of your
                engagement change. If you prefer, you can use{' '}
                <Link size="small" to="../form">
                    the old form
                </Link>
                .
            </SystemMessage>
            <br />
            <FormProvider {...engagementCreationForm}>
                <EngagementForm isNewEngagement onSubmit={onSubmit} />
            </FormProvider>
        </ResponsiveContainer>
    );
};

export default EngagementCreationWizard;
