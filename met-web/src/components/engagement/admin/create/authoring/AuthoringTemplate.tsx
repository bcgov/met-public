import React, { Suspense, useMemo, useState } from 'react';
import { useOutletContext, Form, useParams, Await, Outlet, useMatch, useRouteLoaderData } from 'react-router-dom';
import AuthoringBottomNav from './AuthoringBottomNav';
import { EngagementUpdateData } from './AuthoringContext';
import { useFormContext } from 'react-hook-form';
import { AuthoringContextType, StatusLabelProps } from './types';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';
import { ResponsiveContainer } from 'components/common/Layout';
import { EngagementStatus } from 'constants/engagementStatus';
import { Header1, Header2 } from 'components/common/Typography';
import { useAppSelector } from 'hooks';
import { Language } from 'models/language';
import { getAuthoringRoutes } from './AuthoringNavElements';
import { Engagement } from 'models/engagement';
import { getTenantLanguages } from 'services/languageService';
import { EngagementLoaderData } from 'components/engagement/public/view';

export const StatusLabel = ({ text, completed }: StatusLabelProps) => {
    const statusLabelStyle = {
        background: true === completed ? '#42814A' : '#CE3E39',
        padding: '0.2rem 0.75rem',
        color: '#ffffff',
        borderRadius: '3px',
        fontSize: '0.8rem',
    };
    return <span style={statusLabelStyle}>{text}</span>;
};

export const getLanguageValue = (currentLanguage: string, languages: Language[]) => {
    return languages.find((language) => language.code === currentLanguage)?.name;
};

const AuthoringTemplate = () => {
    const { onSubmit, defaultValues, setDefaultValues, fetcher }: AuthoringContextType = useOutletContext();
    const { engagementId } = useParams() as { engagementId: string }; // We need the engagement ID quickly, so let's grab it from useParams
    const { engagement } = useRouteLoaderData('single-engagement') as EngagementLoaderData;
    const [currentLanguage, setCurrentLanguage] = useState(useAppSelector((state) => state.language.id));

    const tenant = useAppSelector((state) => state.tenant);
    const languages = useMemo(() => getTenantLanguages(tenant.id), [tenant.id]); // todo: Using tenant language list until language data is integrated with the engagement.
    const authoringRoutes = getAuthoringRoutes(Number(engagementId));
    const pageName = useMatch('/engagements/:engagementId/details/authoring/:page')?.params.page;
    const pageTitle = authoringRoutes.find((route) => {
        const pathArray = route.path.split('/');
        return pathArray[pathArray.length - 1] === pageName;
    })?.name;

    const {
        handleSubmit,
        setValue,
        getValues,
        watch,
        reset,
        control,
        formState: { isDirty, isValid, isSubmitting, errors },
    } = useFormContext<EngagementUpdateData>();

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

            <Suspense>
                <Await resolve={languages}>
                    {(languages: Language[]) => (
                        <Header2 decorated style={{ paddingTop: '1rem' }}>
                            {`${getLanguageValue(currentLanguage, languages)} Content`}
                        </Header2>
                    )}
                </Await>
            </Suspense>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <Suspense>
                    <Await resolve={engagement}>
                        {(engagement: Engagement) => (
                            <Outlet
                                context={{
                                    setValue,
                                    watch,
                                    getValues,
                                    setDefaultValues,
                                    reset,
                                    engagement,
                                    control,
                                    isDirty,
                                    errors,
                                    defaultValues,
                                    fetcher,
                                }}
                            />
                        )}
                    </Await>
                </Suspense>
                <Suspense>
                    <Await resolve={languages}>
                        {(languages: Language[]) => (
                            <AuthoringBottomNav
                                isDirty={isDirty}
                                isValid={isValid}
                                isSubmitting={isSubmitting}
                                currentLanguage={currentLanguage}
                                setCurrentLanguage={setCurrentLanguage}
                                languages={languages}
                                pageTitle={pageTitle || 'untitled'}
                                setValue={setValue}
                            />
                        )}
                    </Await>
                </Suspense>
            </Form>
        </ResponsiveContainer>
    );
};

export default AuthoringTemplate;
