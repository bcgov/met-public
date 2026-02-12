import React, { Suspense, useEffect } from 'react';
import { useOutletContext, Form, useParams, Await, Outlet, useMatch, useRouteLoaderData } from 'react-router';
import AuthoringBottomNav from './AuthoringBottomNav';
import { EngagementUpdateData } from './AuthoringContext';
import { useFormContext } from 'react-hook-form';
import { AuthoringContextType, StatusLabelProps } from './types';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';
import { ResponsiveContainer } from 'components/common/Layout';
import { EngagementStatus } from 'constants/engagementStatus';
import { BodyText, Header1, Header2 } from 'components/common/Typography';
import { useAppDispatch, useAppSelector } from 'hooks';
import { Language } from 'models/language';
import { getAuthoringRoutes } from './AuthoringNavElements';
import { Engagement } from 'models/engagement';
import { EngagementLoaderData } from 'components/engagement/public/view';
import { colors } from 'styles/Theme';
import { saveLanguage } from 'reduxSlices/languageSlice';

export const StatusLabel = ({ text, completed }: StatusLabelProps) => {
    const statusColor = completed ? colors.notification.success : colors.notification.error;
    return (
        <BodyText
            size="small"
            p="0.2rem 0.75rem"
            bgcolor={statusColor.shade}
            color="white"
            borderRadius="3px"
            fontSize="0.8rem"
            display="inline"
            lineHeight="unset"
        >
            {text}
        </BodyText>
    );
};

export const getLanguageValue = (languageCode: string, languages: Language[]) => {
    if (languageCode === 'en') {
        return 'English';
    }
    return languages.find((language) => language.code === languageCode)?.name || '';
};

const AuthoringTemplate = () => {
    const { onSubmit, defaultValues, setDefaultValues, fetcher }: AuthoringContextType = useOutletContext();
    const { engagementId } = useParams() as { engagementId: string }; // We need the engagement ID quickly, so let's grab it from useParams
    const { engagement, languages } = useRouteLoaderData('single-engagement') as EngagementLoaderData;
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
            <div style={{ marginTop: '2rem' }}>
                <Suspense>
                    <Await resolve={engagement}>
                        {(engagement: Engagement) => (
                            <StatusLabel text={EngagementStatus[engagement.status_id]} completed={false} />
                        )}
                    </Await>
                </Suspense>
                {/* todo: For the section status label when it's ready */}
                {/* <StatusLabel text={'Insert Section Status Text Here'} completed={'Insert Completed Boolean Here'} /> */}
            </div>
            <Header1 style={{ marginTop: '0.5rem', paddingBottom: '1rem' }}>{pageTitle}</Header1>

            {/* Portal target for anything that needs to be rendered before the section title + content */}
            <div id="pre-authoring-content" />

            <Header2 decorated style={{ paddingTop: '1rem' }}>
                {currentLanguage.name}
            </Header2>

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
        </ResponsiveContainer>
    );
};

export default AuthoringTemplate;
