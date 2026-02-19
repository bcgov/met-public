import React, { createContext, JSX, useEffect, useState } from 'react';
import { Engagement } from 'models/engagement';
import { useParams } from 'react-router';
import { getEngagements } from 'services/engagementService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { Survey } from 'models/survey';
import { getSurveysPage } from 'services/surveyService';

const PAGE = 1;

const PAGE_SIZE = 2000;

const SORT_ORDER = 'asc';

interface CreateSurveyContextValues {
    surveyForm: SurveyForm;
    handleSurveyFormChange: (_form: SurveyForm) => void;
    loading: boolean;
    availableSurveys: Survey[] | null;
    setAvailableSurveys: (surveys: Survey[]) => void;
    availableEngagements: Engagement[] | null;
    setAvailableEngagements: (engagements: Engagement[]) => void;
    isDisclaimerChecked: boolean;
    setIsDisclaimerChecked: (checked: boolean) => void;
    disclaimerError: boolean;
    setDisclaimerError: (error: boolean) => void;
}

const initialSurveyForm = {
    name: '',
    engagement_id: -1,
    survey_id: -1,
};
export const CreateSurveyContext = createContext<CreateSurveyContextValues>({
    surveyForm: initialSurveyForm,
    handleSurveyFormChange: (_form: SurveyForm) => {},
    loading: true,
    availableSurveys: null,
    setAvailableSurveys: (_surveys: Survey[]) => {},
    availableEngagements: null,
    setAvailableEngagements: (_engagements: Engagement[]) => {},
    isDisclaimerChecked: false,
    setIsDisclaimerChecked: (_checked: boolean) => {
        throw new Error('setIsDisclaimerChecked method not implemented');
    },
    disclaimerError: false,
    setDisclaimerError: (_error: boolean) => {
        throw new Error('setDisclaimerError method not implemented');
    },
});

export interface SurveyForm {
    name: string;
    engagement_id: number;
    survey_id?: number;
    structure?: unknown;
}

export const CreateSurveyContextProvider = ({ children }: { children: JSX.Element }) => {
    const dispatch = useAppDispatch();
    const [surveyForm, setSurveyForm] = useState<SurveyForm>(initialSurveyForm);
    const [loading, setLoading] = useState(true);
    const [availableSurveys, setAvailableSurveys] = useState<Survey[] | null>(null);
    const [availableEngagements, setAvailableEngagements] = useState<Engagement[] | null>(null);
    const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(false);
    const [disclaimerError, setDisclaimerError] = useState(false);
    const params = useParams();
    const tenantId = Number(params.tenantId || '');

    const handleSurveyFormChange = (form: SurveyForm) => {
        setSurveyForm(form);
    };

    useEffect(() => {
        if (!availableEngagements) {
            handleFetchEngagements(PAGE, PAGE_SIZE, SORT_ORDER, tenantId);
        }
    }, [availableEngagements]);

    useEffect(() => {
        if (!availableSurveys) {
            handleFetchSurveys(PAGE, PAGE_SIZE, SORT_ORDER);
        }
    }, [availableEngagements]);

    const handleFetchSurveys = async (page: number, size: number, sort_order: 'asc' | 'desc' | undefined) => {
        try {
            const fetchedSurveys = await getSurveysPage({
                page: page,
                size: size,
                sort_order: sort_order,
                exclude_hidden: true,
            });
            setAvailableSurveys(fetchedSurveys.items);
        } catch {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching available surveys' }));
        }
    };

    useEffect(() => {
        handleFetchSurveys(PAGE, PAGE_SIZE, SORT_ORDER);
    }, []);

    const handleFetchEngagements = async (
        page: number,
        size: number,
        sort_order: 'asc' | 'desc' | undefined,
        tenant_id: number | undefined,
    ) => {
        setLoading(true);
        try {
            const fetchedEngagements = await getEngagements({
                page: page,
                size: size,
                sort_order: sort_order,
                tenant_id: tenant_id,
            });
            if (fetchedEngagements?.items) {
                const filteredEngagements = fetchedEngagements?.items.filter(
                    // Filter out engagements that aren't from this tenant
                    (fe) => fe.tenant_id !== tenantId,
                );
                setAvailableEngagements(filteredEngagements);
            }
        } catch {
            dispatch(
                openNotification({ severity: 'error', text: 'Error occurred while fetching available engagements' }),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <CreateSurveyContext.Provider
            value={{
                surveyForm,
                handleSurveyFormChange,
                loading,
                availableSurveys,
                setAvailableSurveys,
                setAvailableEngagements,
                availableEngagements,
                isDisclaimerChecked,
                setIsDisclaimerChecked,
                disclaimerError,
                setDisclaimerError,
            }}
        >
            {children}
        </CreateSurveyContext.Provider>
    );
};
