import React, { Suspense, useMemo, useState } from 'react';
import { useOutletContext, Form, useParams, Await, Outlet, useLoaderData } from 'react-router-dom';
import AuthoringBottomNav from './AuthoringBottomNav';
import { EngagementUpdateData } from './AuthoringContext';
import { useFormContext } from 'react-hook-form';
import UnsavedWorkConfirmation from 'components/common/Navigation/UnsavedWorkConfirmation';
import { AuthoringContextType, StatusLabelProps } from './types';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';
import { ResponsiveContainer } from 'components/common/Layout';
import { EngagementStatus } from 'constants/engagementStatus';
import { EyebrowText, Header2 } from 'components/common/Typography';
import { useAppSelector } from 'hooks';
import { Language } from 'models/language';
import { getAuthoringRoutes } from './AuthoringNavElements';
import { FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import { SystemMessage } from 'components/common/Layout/SystemMessage';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { When } from 'react-if';
import WidgetPicker from '../widgets';
import { WidgetLocation } from 'models/widget';
import { Engagement } from 'models/engagement';
import { getTenantLanguages } from 'services/languageService';

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
    const { engagement } = useLoaderData() as { engagement: Promise<Engagement> };
    const [currentLanguage, setCurrentLanguage] = useState(useAppSelector((state) => state.language.id));
    const [contentTabsEnabled, setContentTabsEnabled] = useState('false'); // todo: replace default value with stored value in engagement.
    const defaultTabValues = {
        heading: 'Tab 1',
        bodyCopyPlainText: '',
        bodyCopyEditorState: getEditorStateFromRaw(''),
        widget: '',
    };
    const [tabs, setTabs] = useState([defaultTabValues]);
    const [singleContentValues, setSingleContentValues] = useState({ ...defaultTabValues, heading: '' });

    const tenant = useAppSelector((state) => state.tenant);
    const languages = useMemo(() => getTenantLanguages(tenant.id), [tenant.id]); // todo: Using tenant language list until language data is integrated with the engagement.
    const authoringRoutes = getAuthoringRoutes(Number(engagementId), tenant);
    const location = window.location.href;
    const locationArray = location.split('/');
    const slug = locationArray[locationArray.length - 1];
    const pageTitle = authoringRoutes.find((route) => {
        const pathArray = route.path.split('/');
        const pathSlug = pathArray[pathArray.length - 1];
        return pathSlug === slug;
    })?.name;

    const {
        handleSubmit,
        setValue,
        getValues,
        watch,
        reset,
        control,
        formState: { isDirty, isValid, isSubmitting },
    } = useFormContext<EngagementUpdateData>();

    const eyebrowTextStyles = {
        fontSize: '0.9rem',
        marginBottom: '1rem',
    };

    // If switching from single to multiple, add "tab 2". If switching from multiple to single, remove all values but index 0.
    const handleTabsRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTabsRadioValue = event.target.value;
        if ('true' === newTabsRadioValue) {
            setTabs([
                { ...tabs[0], heading: singleContentValues.heading ? singleContentValues.heading : 'Tab 1' },
                { ...defaultTabValues, heading: 'Tab 2' },
            ]);
            setContentTabsEnabled('true');
        } else {
            setSingleContentValues({ ...tabs[0], heading: 'Tab 1' !== tabs[0].heading ? tabs[0].heading : '' });
            setTabs([tabs[0]]);
            setContentTabsEnabled('false');
        }
    };

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
            <h1 style={{ marginTop: '0.5rem', paddingBottom: '1rem' }}>{pageTitle}</h1>
            <SystemMessage status="warning">
                Under construction - the settings in this section have no effect.
            </SystemMessage>
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
                                    setTabs,
                                    setSingleContentValues,
                                    setContentTabsEnabled,
                                    getValues,
                                    setDefaultValues,
                                    reset,
                                    engagement,
                                    control,
                                    contentTabsEnabled,
                                    tabs,
                                    singleContentValues,
                                    defaultTabValues,
                                    isDirty,
                                    defaultValues,
                                    fetcher,
                                    slug,
                                }}
                            />
                        )}
                    </Await>
                </Suspense>
                <UnsavedWorkConfirmation blockNavigationWhen={isDirty && !isSubmitting} />
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

            <When condition={'summary' === slug}>
                <Grid container sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
                    <WidgetPicker location={WidgetLocation.Summary} />
                </Grid>
            </When>
        </ResponsiveContainer>
    );
};

export default AuthoringTemplate;
