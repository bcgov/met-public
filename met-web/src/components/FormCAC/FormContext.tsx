import React, { createContext, useEffect, useState } from 'react';
import { TAB_ONE } from './constants';
import { useNavigate, useParams } from 'react-router-dom';
import { Engagement } from 'models/engagement';
import { getEngagement } from 'services/engagementService';
import { EngagementStatus } from 'constants/engagementStatus';
import { useDispatch } from 'react-redux';
import { openNotification } from 'services/notificationService/notificationSlice';
import { submitCACForm } from 'services/FormCAC';
import { getSubscriptionsForms } from 'services/subscriptionService';
import { SUBSCRIBE_TYPE, SubscribeForm } from 'models/subscription';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { getSlugByEngagementId } from 'services/engagementSlugService';
import { useAppTranslation } from 'hooks';

export interface CACFormSubmssion {
    understand: boolean;
    termsOfReference: boolean;
    firstName: string;
    lastName: string;
    city: string;
    email: string;
}

export interface FormContextProps {
    tabValue: number;
    setTabValue: (value: number) => void;
    formSubmission: CACFormSubmssion;
    setFormSubmission: React.Dispatch<React.SetStateAction<CACFormSubmssion>>;
    loading: boolean;
    submitting: boolean;
    setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    consentMessage: string;
}

export const FormContext = createContext<FormContextProps>({
    tabValue: 1,
    setTabValue: () => {
        return;
    },
    formSubmission: {
        understand: false,
        termsOfReference: false,
        firstName: '',
        lastName: '',
        city: '',
        email: '',
    },
    setFormSubmission: () => {
        return;
    },
    loading: true,
    submitting: false,
    setSubmitting: () => {
        return;
    },
    consentMessage: '',
});
export const FormContextProvider = ({ children }: { children: JSX.Element }) => {
    const { t: translate } = useAppTranslation();
    const { widgetId, engagementId } = useParams<{ widgetId: string; engagementId: string }>();
    const [tabValue, setTabValue] = useState(TAB_ONE);
    const [formSubmission, setFormSubmission] = useState<CACFormSubmssion>({
        understand: false,
        termsOfReference: false,
        firstName: '',
        lastName: '',
        city: '',
        email: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [engagement, setEngagement] = useState<Engagement | null>(null);
    const [engagementSlug, setEngagementSlug] = useState<string>('');
    const [consentMessage, setConsentMessage] = useState<string>('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loadEngagement = async () => {
        if (isNaN(Number(engagementId))) {
            return;
        }
        try {
            setLoading(true);
            const engagement = await getEngagement(Number(engagementId));
            return engagement;
        } catch (err) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: translate('formCAC.formContentNotification.engagementError'),
                }),
            );
            navigate('/');
        }
    };

    const loadWidget = async () => {
        if (isNaN(Number(widgetId))) {
            return;
        }
        try {
            setLoading(true);
            const subscriptionForms = await getSubscriptionsForms(Number(widgetId));

            return subscriptionForms.find((form) => form.type === SUBSCRIBE_TYPE.SIGN_UP);
        } catch (err) {
            dispatch(
                openNotification({ severity: 'error', text: translate('formCAC.formContentNotification.widgetError') }),
            );
            navigate('/');
        }
    };

    const verifyData = (_engagement?: Engagement, subscribeWidget?: SubscribeForm) => {
        if (!_engagement || !subscribeWidget) {
            dispatch(
                openNotification({ severity: 'error', text: translate('formCAC.formContentNotification.formError') }),
            );
            navigate('/');
        } else if (_engagement.engagement_status.id === EngagementStatus.Draft) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: translate('formCAC.formContentNotification.unknownError'),
                }),
            );
            navigate('/');
        }
        setLoading(false);
    };

    const loadData = async () => {
        const engagement = await loadEngagement();
        setEngagement(engagement ?? null);
        setConsentMessage(engagement?.consent_message ?? '');
        const subscribeWidget = await loadWidget();
        verifyData(engagement, subscribeWidget);
        loadEngagementSlug();
    };

    useEffect(() => {
        loadData();
    }, [widgetId, engagementId]);

    const loadEngagementSlug = async () => {
        if (!engagementId) return;
        const engagementSlug = await getSlugByEngagementId(Number(engagementId));
        setEngagementSlug(engagementSlug.slug);
    };

    const submitForm = async () => {
        try {
            await submitCACForm({
                engagement_id: Number(engagementId),
                widget_id: Number(widgetId),
                form_data: {
                    understand: formSubmission.understand,
                    terms_of_reference: formSubmission.termsOfReference,
                    first_name: formSubmission.firstName,
                    last_name: formSubmission.lastName,
                    city: formSubmission.city,
                    email: formSubmission.email,
                },
            });
            dispatch(
                openNotificationModal({
                    open: true,
                    data: {
                        header: translate('formCAC.formContentNotification.success.header'),
                        subText: [
                            {
                                text:
                                    translate('formCAC.formContentNotification.success.text.0') +
                                    `${engagement?.name}` +
                                    translate('formCAC.formContentNotification.success.text.1'),
                            },
                        ],
                    },
                    type: 'update',
                }),
            );
            navigate(`/${engagementSlug}`, { replace: true });
        } catch (err) {
            setSubmitting(false);
            console.log(err);
            dispatch(
                openNotification({ severity: 'error', text: translate('formCAC.formContentNotification.submitError') }),
            );
        }
    };

    useEffect(() => {
        if (submitting) {
            submitForm();
        }
    }, [submitting]);

    return (
        <FormContext.Provider
            value={{
                tabValue,
                setTabValue,
                formSubmission,
                setFormSubmission,
                loading,
                submitting,
                setSubmitting,
                consentMessage,
            }}
        >
            {children}
        </FormContext.Provider>
    );
};
