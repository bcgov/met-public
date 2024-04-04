import React, { createContext, useContext, useState, useEffect } from 'react';
import { CONTENT_TYPE } from 'models/engagementContent';
import { getSummaryContent } from 'services/engagementSummaryService';
import { getCustomContent } from 'services/engagementCustomService';
import { ActionContext } from '../../ActionContext';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface EngagementContentProps {
    isSummaryContentsLoading: boolean;
    setIsSummaryContentsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isCustomContentsLoading: boolean;
    setIsCustomContentsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isEditMode: boolean;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EngagementContentContext = createContext<EngagementContentProps>({
    isSummaryContentsLoading: false,
    setIsSummaryContentsLoading: async () => {
        /* empty default method  */
    },
    isCustomContentsLoading: false,
    setIsCustomContentsLoading: async () => {
        /* empty default method  */
    },
    isEditMode: false,
    setIsEditMode: async () => {
        /* empty default method  */
    },
});

export const EngagementContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const dispatch = useAppDispatch();
    const { contentTabs, savedEngagement } = useContext(ActionContext);
    const {
        setRichContent,
        engagementFormData,
        setEngagementFormData,
        setEngagementSummaryContent,
        setEngagementCustomContent,
        setCustomTextContent,
        setCustomJsonContent,
    } = useContext(EngagementTabsContext);
    const [isSummaryContentsLoading, setIsSummaryContentsLoading] = useState(true);
    const [isCustomContentsLoading, setIsCustomContentsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const summaryItem = contentTabs.find((item) => item.content_type === CONTENT_TYPE.SUMMARY);
    const customItem = contentTabs.find((item) => item.content_type === CONTENT_TYPE.CUSTOM);

    const fetchEngagementSummaryContent = async () => {
        if (!savedEngagement.id || !summaryItem) {
            setIsSummaryContentsLoading(false);
            return;
        }
        try {
            const result = await getSummaryContent(summaryItem.id);
            setEngagementSummaryContent(result[0]);
            setRichContent(result[0].rich_content);
            setEngagementFormData({
                ...engagementFormData,
                content: result[0].content,
            });
            setIsSummaryContentsLoading(false);
        } catch (error) {
            setIsSummaryContentsLoading(false);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching engagement summary content',
                }),
            );
        }
    };

    const fetchEngagementCustomContent = async () => {
        if (!savedEngagement.id || !customItem) {
            setIsCustomContentsLoading(false);
            return;
        }
        try {
            const result = await getCustomContent(customItem.id);
            setEngagementCustomContent(result[0]);
            setCustomTextContent(result[0].custom_text_content);
            setCustomJsonContent(result[0].custom_json_content);
            setIsCustomContentsLoading(false);
        } catch (error) {
            setIsCustomContentsLoading(false);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching engagement custom content',
                }),
            );
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchEngagementSummaryContent();
        };

        fetchData();
    }, [summaryItem]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchEngagementCustomContent();
        };

        fetchData();
    }, [customItem]);

    return (
        <EngagementContentContext.Provider
            value={{
                isSummaryContentsLoading,
                setIsSummaryContentsLoading,
                isCustomContentsLoading,
                setIsCustomContentsLoading,
                isEditMode,
                setIsEditMode,
            }}
        >
            {children}
        </EngagementContentContext.Provider>
    );
};
