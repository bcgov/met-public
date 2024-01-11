import React, { createContext, useContext, useState, useMemo } from 'react';
import { ActionContext } from '../../ActionContext';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { SubmissionStatus } from 'constants/engagementStatus';

export interface AdditionalDetailsContextState {
    initialConsentMessage: string;
    setInitialConsentMessage: (richContent: string) => void;
    consentMessage: string;
    setConsentMessage: (richContent: string) => void;
    handleSaveAdditional: () => void;
    updatingAdditional: boolean;
    hasBeenOpened: boolean;
}

export const AdditionalDetailsContext = createContext<AdditionalDetailsContextState>({
    initialConsentMessage: '',
    setInitialConsentMessage: () => {
        return;
    },
    consentMessage: '',
    setConsentMessage: () => {
        return;
    },
    handleSaveAdditional: () => {
        return;
    },
    updatingAdditional: false,
    hasBeenOpened: false,
});

export const AdditionalDetailsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { handleUpdateEngagementRequest, savedEngagement } = useContext(ActionContext);
    const { engagementFormData } = useContext(EngagementTabsContext);
    const dispatch = useAppDispatch();

    const [updatingAdditional, setUpdatingAdditional] = useState(false);
    const [consentMessage, setConsentMessage] = useState(savedEngagement?.consent_message || '');
    const [initialConsentMessage, setInitialConsentMessage] = useState(savedEngagement?.consent_message || '');

    const handleUpdateEngagementAdditional = () => {
        return handleUpdateEngagementRequest({
            ...engagementFormData,
            consent_message: consentMessage,
        });
    };

    const handleSaveAdditional = async () => {
        try {
            if (!savedEngagement.id) {
                dispatch(openNotification({ text: 'Must create engagement first', severity: 'error' }));
                return;
            }
            setUpdatingAdditional(true);
            await handleUpdateEngagementAdditional();
            setUpdatingAdditional(false);
            dispatch(openNotification({ text: 'Engagement additional details saved', severity: 'success' }));
        } catch (error) {
            setUpdatingAdditional(false);
            dispatch(openNotification({ text: 'Error saving engagement additional details', severity: 'error' }));
        }
    };

    const hasBeenOpened = [SubmissionStatus.Closed, SubmissionStatus.Open].includes(
        savedEngagement.engagement_status.id,
    );

    const contextValue = useMemo(
        () => ({
            initialConsentMessage,
            setInitialConsentMessage,
            consentMessage,
            setConsentMessage,
            handleSaveAdditional,
            updatingAdditional,
            hasBeenOpened,
        }),
        [initialConsentMessage, consentMessage, updatingAdditional, hasBeenOpened],
    );

    return <AdditionalDetailsContext.Provider value={contextValue}>{children}</AdditionalDetailsContext.Provider>;
};
