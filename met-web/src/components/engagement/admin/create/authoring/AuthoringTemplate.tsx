import React, { Suspense, useEffect } from 'react';
import { useOutletContext, Form, useParams, Await, Outlet, useMatch, useRouteLoaderData } from 'react-router';
import AuthoringBottomNav from './AuthoringBottomNav';
import { EngagementUpdateData } from './AuthoringContext';
import { useFormContext } from 'react-hook-form';
import { AuthoringContextType } from './types';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';
import { ResponsiveContainer } from 'components/common/Layout';
import { Header1, Header2 } from 'components/common/Typography';
import { useAppDispatch, useAppSelector } from 'hooks';
import { Language } from 'models/language';
import { getAuthoringRoutes } from './AuthoringNavElements';
import { Engagement } from 'models/engagement';
import { EngagementLoaderAdminData } from 'components/engagement/admin/EngagementLoaderAdmin';
import { saveLanguage } from 'reduxSlices/languageSlice';
import Grid from '@mui/material/Grid2';
import { StatusLabel } from './StatusLabel';

export const getLanguageValue = (languageCode: string, languages: Language[]) => {
    if (languageCode === 'en') {
        return 'English';
    }
    return languages.find((language) => language.code === languageCode)?.name || '';
};

const AuthoringTemplate = () => {
    const { onSubmit, defaultValues, setDefaultValues, fetcher }: AuthoringContextType = useOutletContext();
    const { engagementId } = useParams() as { engagementId: string }; // We need the engagement ID quickly, so let's grab it from useParams
    const { engagement, languages } = useRouteLoaderData('single-engagement') as EngagementLoaderAdminData;
    const dispatch = useAppDispatch();
    const currentLanguage = useAppSelector((state) => state.language);
    const setCurrentLanguage = React.useCallback(
        (code: string, name: string) => dispatch(saveLanguage({ id: code, name: name })),
        [dispatch],
    );
    const authoringRoutes = getAuthoringRoutes(Number(engagementId));
    const pageName = useMatch('/engagements/:engagementId/details/authoring/:page')?.params.page;
    const pageTitle = authoringRoutes.find((route) => {
        const pathArray = route.path.split('/');
        return pathArray[pathArray.length - 1] === pageName;
    })?.name;

    const {
        handleSubmit,
        formState: { isDirty },
    } = useFormContext<EngagementUpdateData>();
    const outletKey = pageName || 'authoring';

    // Prevent refresh/navigation if there are unsaved changes
    useEffect(() => {
        if (!isDirty) return;
        const handler = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [isDirty]);

    return (
        <ResponsiveContainer>
            <AutoBreadcrumbs />
            <Grid mt="2rem" size={12}>
                <Suspense>
                    <Await resolve={engagement}>
                        {(engagement: Engagement) => <StatusLabel status={engagement.status_id} />}
                    </Await>
                </Suspense>
                {/* todo: For the section status label when it's ready */}
                {/* <StatusLabel text={'Insert Section Status Text Here'} completed={'Insert Completed Boolean Here'} /> */}
            </Grid>
            <Grid size={12}>
                <Header1 style={{ marginTop: '0.5rem', paddingBottom: '1rem' }}>{pageTitle}</Header1>
            </Grid>

            {/* Portal target for anything that needs to be rendered before the section title + content */}
            <div id="pre-authoring-content" />

            <Grid size={12}>
                <Header2 decorated style={{ paddingTop: '1rem' }}>
                    {currentLanguage.name}
                </Header2>
            </Grid>

            <Grid>
                <Form onSubmit={handleSubmit(onSubmit)} id="authoring-form">
                    <Suspense>
                        <Await resolve={engagement}>
                            {(engagement: Engagement) => (
                                <Outlet
                                    key={outletKey}
                                    context={{
                                        setDefaultValues,
                                        engagement,
                                        defaultValues,
                                        fetcher,
                                        pageName,
                                    }}
                                />
                            )}
                        </Await>
                    </Suspense>
                    <AuthoringBottomNav
                        currentLanguage={currentLanguage}
                        setCurrentLanguage={setCurrentLanguage}
                        languages={languages}
                        pageTitle={pageTitle || 'untitled'} // Full title
                        pageName={pageName || 'untitled'} // Slug
                    />
                </Form>
            </Grid>
        </ResponsiveContainer>
    );
};

export default AuthoringTemplate;
