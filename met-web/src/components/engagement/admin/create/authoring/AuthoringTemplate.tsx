import React, { Suspense, useMemo, useState } from 'react';
import { useOutletContext, Form, useParams, useRouteLoaderData, Await, Outlet } from 'react-router-dom';
import AuthoringBottomNav from './AuthoringBottomNav';
import { EngagementUpdateData } from './AuthoringContext';
import { useFormContext } from 'react-hook-form';
import UnsavedWorkConfirmation from 'components/common/Navigation/UnsavedWorkConfirmation';
import { AuthoringContextType, StatusLabelProps } from './types';
import { Engagement } from 'models/engagement';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';
import { ResponsiveContainer } from 'components/common/Layout';
import { EngagementStatus } from 'constants/engagementStatus';
import { EyebrowText, Header2 } from 'components/common/Typography';
import { useAppSelector } from 'hooks';
import { getTenantLanguages } from 'services/languageService';
import { Language } from 'models/language';
import { getAuthoringRoutes } from './AuthoringNavElements';
import { FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import { SystemMessage } from 'components/common/Layout/SystemMessage';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';

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
    const { onSubmit }: AuthoringContextType = useOutletContext();
    const { engagementId } = useParams() as { engagementId: string }; // We need the engagement ID quickly, so let's grab it from useParams
    const { engagement } = useRouteLoaderData('single-engagement') as { engagement: Engagement };
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
        watch,
        control,
        formState: { isDirty, isValid, isSubmitting },
    } = useFormContext<EngagementUpdateData>();

    // Set hidden values for form data
    setValue('id', Number(engagementId));

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
            <Suspense>
                <Await resolve={engagement}>
                    {(engagement: Engagement) => (
                        <div style={{ marginTop: '2rem' }}>
                            <StatusLabel text={EngagementStatus[engagement?.status_id]} completed={false} />
                            {/* todo: For the section status label when it's ready */}
                            {/* <StatusLabel text={'Insert Section Status Text Here'} completed={'Insert Completed Boolean Here'} /> */}
                        </div>
                    )}
                </Await>
            </Suspense>
            <h1 style={{ marginTop: '0.5rem', paddingBottom: '1rem' }}>{pageTitle}</h1>
            <SystemMessage status="warning">
                Under construction - the settings in this section have no effect.
            </SystemMessage>
            {'details' === slug && (
                <Grid container sx={{ maxWidth: '700px' }}>
                    <Header2 decorated style={{ paddingTop: '1rem' }}>
                        Content Configuration
                    </Header2>
                    <EyebrowText sx={eyebrowTextStyles}>
                        In the Details Section of your engagement, you have the option to display your content in a
                        normal, static page section view (No Tabs), or for lengthy content, use Tabs. You may wish to
                        use tabs if your content is quite lengthy so you can organize it into smaller, more digestible
                        chunks and reduce the length of your engagement page.
                    </EyebrowText>
                    <RadioGroup
                        row
                        id="tabs_enabled"
                        name="tabs_enabled"
                        defaultValue="false"
                        value={contentTabsEnabled}
                        onChange={handleTabsRadio}
                        sx={{ flexWrap: 'nowrap', fontSize: '0.8rem', mb: '1rem', width: '100%' }}
                    >
                        <Grid item xs={6}>
                            <FormControlLabel
                                aria-label="No Tabs: Select the no tabs option if you only want one content section."
                                value="false"
                                control={<Radio />}
                                label="No Tabs"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel
                                aria-label="Tabs (2 Minimum): Select the tabs option for lengthly content so you can break it into smaller chunks."
                                value="true"
                                control={<Radio />}
                                label="Tabs (2 Minimum)"
                            />
                        </Grid>
                    </RadioGroup>
                </Grid>
            )}
            <Header2 decorated style={{ paddingTop: '1rem' }}>
                <Suspense>
                    <Await resolve={languages}>
                        {(languages: Language[]) => getLanguageValue(currentLanguage, languages) + ' Content'}
                    </Await>
                </Suspense>
            </Header2>

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
                                    control,
                                    engagement,
                                    contentTabsEnabled,
                                    tabs,
                                    singleContentValues,
                                    defaultTabValues,
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
                            />
                        )}
                    </Await>
                </Suspense>
            </Form>
        </ResponsiveContainer>
    );
};

export default AuthoringTemplate;
