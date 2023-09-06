import React, { createContext, useEffect, useState } from 'react';
import { TAB_ONE } from './constants';
import { Widget, WidgetType } from 'models/widget';
import { useNavigate, useParams } from 'react-router-dom';
import { Engagement } from 'models/engagement';
import { getEngagement } from 'services/engagementService';
import { EngagementStatus } from 'constants/engagementStatus';
import { useDispatch } from 'react-redux';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getWidget } from 'services/widgetService';
import { submitCACForm } from 'services/FormCAC';
import { getSubscriptionsForms } from 'services/subscriptionService';
import { SUBSCRIBE_TYPE, SubscribeForm } from 'models/subscription';

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
});
export const FormContextProvider = ({ children }: { children: JSX.Element }) => {
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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loadEngagement = async () => {
        if (isNaN(Number(engagementId))) {
            return;
        }
        try {
            setLoading(true);
            return getEngagement(Number(engagementId));
        } catch (err) {
            dispatch(
                openNotification({ severity: 'error', text: 'An error occured while trying to load the engagement' }),
            );
        }
    };

    const loadWidget = async () => {
        if (isNaN(Number(widgetId))) {
            return;
        }
        try {
            setLoading(true);
            const subscriptionForms = await getSubscriptionsForms(Number(widgetId));

            //TODO: Change type check to Form type
            return subscriptionForms.find((form) => form.type === SUBSCRIBE_TYPE.EMAIL_LIST);
        } catch (err) {
            dispatch(openNotification({ severity: 'error', text: 'An error occured while trying to load the widget' }));
        }
    };

    const verifyData = (engagement?: Engagement, subscribeWidget?: SubscribeForm) => {
        if (!engagement || !subscribeWidget) {
            dispatch(openNotification({ severity: 'error', text: 'An error occured while trying to load the form' }));
            navigate('/');
        } else if (engagement.engagement_status.id === EngagementStatus.Draft) {
            dispatch(openNotification({ severity: 'error', text: 'Cannot submit this form at this time' }));
            navigate('/');
        }
        setLoading(false);
    };

    const loadData = async () => {
        const engagement = await loadEngagement();
        const subscribeWidget = await loadWidget();
        verifyData(engagement, subscribeWidget);
    };

    useEffect(() => {
        loadData();
    }, [widgetId, engagementId]);

    const submitForm = async () => {
        try {
            await submitCACForm({
                engagement_id: Number(widgetId),
                widget_id: Number(engagementId),
                form_data: {
                    understand: formSubmission.understand,
                    terms_of_reference: formSubmission.termsOfReference,
                    first_name: formSubmission.firstName,
                    last_name: formSubmission.lastName,
                    city: formSubmission.city,
                    email: formSubmission.email,
                },
            });
            dispatch(openNotification({ severity: 'success', text: 'The form has been submitted successfully' }));
            navigate('/');
        } catch (err) {
            setSubmitting(false);
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'An error occured while trying to submit the form' }));
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
            }}
        >
            {children}
        </FormContext.Provider>
    );
};
