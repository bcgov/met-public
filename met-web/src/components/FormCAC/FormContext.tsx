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
            return getWidget(Number(engagementId), Number(widgetId));
        } catch (err) {
            dispatch(openNotification({ severity: 'error', text: 'An error occured while trying to load the widget' }));
        }
    };

    const verifyData = (engagement?: Engagement, widget?: Widget) => {
        if (!engagement || !widget) {
            dispatch(openNotification({ severity: 'error', text: 'An error occured while trying to load the form' }));
            navigate('/');
        } else if (engagement.engagement_status.id === EngagementStatus.Draft) {
            dispatch(openNotification({ severity: 'error', text: 'Cannot submit this form at this time' }));
            navigate('/');
        } else if (widget.widget_type_id !== WidgetType.CACForm) {
            dispatch(openNotification({ severity: 'error', text: 'Cannot submit this form for this engagement' }));
            navigate('/');
        }
        setLoading(false);
    };

    const loadData = async () => {
        const engagement = await loadEngagement();
        const widget = await loadWidget();
        verifyData(engagement, widget);
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
