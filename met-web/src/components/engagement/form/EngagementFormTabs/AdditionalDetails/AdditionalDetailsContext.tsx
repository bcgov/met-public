import React, { createContext, useContext, useState, useMemo, useRef } from 'react';
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
    metadataFormRef: React.RefObject<HTMLFormElement> | null;
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
    metadataFormRef: null,
});

export const AdditionalDetailsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { handleUpdateEngagementRequest, savedEngagement } = useContext(ActionContext);
    const { engagementFormData } = useContext(EngagementTabsContext);
    const dispatch = useAppDispatch();

    const metadataFormRef = useRef<HTMLFormElement>(null);

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
                dispatch(openNotification({ text: 'Engagement Content must be saved first', severity: 'error' }));
                return;
            }
            setUpdatingAdditional(true);
            if (!metadataFormRef) dispatch(openNotification({ text: 'Metadata Form not found', severity: 'error' }));
            const metadataResult = await metadataFormRef?.current?.submitForm();

            if (metadataResult === false) {
                dispatch(
                    openNotification({
                        text: 'Please correct the highlighted errors before saving',
                        severity: 'error',
                    }),
                );
                setUpdatingAdditional(false);
                return;
            }
            await handleUpdateEngagementAdditional();
            setUpdatingAdditional(false);
            dispatch(openNotification({ text: 'Additional Details saved', severity: 'success' }));
        } catch (error) {
            setUpdatingAdditional(false);
            console.log('Error saving Additional Details', error);
            dispatch(openNotification({ text: 'Error saving Additional Details', severity: 'error' }));
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
            metadataFormRef,
        }),
        [initialConsentMessage, consentMessage, updatingAdditional, hasBeenOpened],
    );

    return <AdditionalDetailsContext.Provider value={contextValue}>{children}</AdditionalDetailsContext.Provider>;
};
