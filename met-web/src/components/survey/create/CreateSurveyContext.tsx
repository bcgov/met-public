import React, { createContext, useEffect, useState } from 'react';
import { Engagement } from 'models/engagement';
import { useNavigate, useLocation } from 'react-router-dom';
import { getEngagement } from 'services/engagementService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { Survey } from 'models/survey';

interface CreateSurveyContextValues {
    surveyForm: SurveyForm;
    handleSurveyFormChange: (_form: SurveyForm) => void;
    engagementToLink: Engagement | null;
    loading: boolean;
    availableSurveys: Survey[] | null;
    setAvailableSurveys: (surveys: Survey[]) => void;
}

const initialSurveyForm = {
    name: '',
};
export const CreateSurveyContext = createContext<CreateSurveyContextValues>({
    surveyForm: initialSurveyForm,
    handleSurveyFormChange: (_form: SurveyForm) => {
        //empty method
    },
    engagementToLink: null,
    loading: true,
    availableSurveys: null,
    setAvailableSurveys: (_surveys: Survey[]) => {
        //empty method
    },
});

interface SurveyForm {
    name: string;
    structure?: unknown;
}

export const CreateSurveyContextProvider = ({ children }: { children: JSX.Element }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [surveyForm, setSurveyForm] = useState<SurveyForm>(initialSurveyForm);
    const [loading, setLoading] = useState(true);
    const [engagementToLink, setEngagementToLink] = useState<Engagement | null>(null);
    const [availableSurveys, setAvailableSurveys] = useState<Survey[] | null>(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const engagementId = searchParams.get('engagementId');

    useEffect(() => {
        fetchEngagementToLink();
    }, [engagementId]);

    const fetchEngagementToLink = async () => {
        if (!engagementId || isNaN(Number(engagementId))) {
            setLoading(false);
            return;
        }
        try {
            const engagement = await getEngagement(Number(engagementId));
            setEngagementToLink(engagement);
            setLoading(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error fetching the linked engagement' }));
            navigate(-1);
        }
    };

    const handleSurveyFormChange = (form: SurveyForm) => {
        setSurveyForm(form);
    };

    return (
        <CreateSurveyContext.Provider
            value={{
                surveyForm,
                handleSurveyFormChange,
                engagementToLink,
                loading,
                availableSurveys,
                setAvailableSurveys,
            }}
        >
            {children}
        </CreateSurveyContext.Provider>
    );
};
