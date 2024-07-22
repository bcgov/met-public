import React, { createContext, useContext, useState, useEffect } from 'react';
import { CONTENT_TYPE } from 'models/engagementContent';
import { ActionContext } from '../../ActionContext';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { useRouteLoaderData } from 'react-router-dom';
import { EngagementSummaryContent } from 'models/engagementSummaryContent';
import { EngagementCustomContent } from 'models/engagementCustomContent';

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
    const routeLoaderData = useRouteLoaderData('single-engagement') as
        | {
              contentSummary: Promise<EngagementSummaryContent[]>;
              customContent: Promise<EngagementCustomContent[]>;
          }
        | undefined;
    const { contentSummary, customContent } = routeLoaderData ?? {};

    // Load the engagement's summary from the shared individual engagement loader and watch the summary item variable for any changes.
    useEffect(() => {
        if (!savedEngagement.id || !summaryItem) {
            setIsSummaryContentsLoading(false);
            return;
        }
        if (savedEngagement && contentSummary) {
            contentSummary.then((result: EngagementSummaryContent[]) => {
                setEngagementSummaryContent(result[0]);
                setRichContent(result[0].rich_content);
                setEngagementFormData({
                    ...engagementFormData,
                    content: result[0].content,
                });
                setIsSummaryContentsLoading(false);
            });
        }
    }, [summaryItem, contentSummary, savedEngagement]);

    // Load the engagement's custom content from the shared individual engagement loader and watch the customItem variable for any changes.
    useEffect(() => {
        if (savedEngagement && customContent) {
            customContent.then((result: EngagementCustomContent[]) => {
                if (!savedEngagement.id || !customItem) {
                    setIsCustomContentsLoading(false);
                    return;
                }
                setEngagementCustomContent(result);
                console.log(result);
                setCustomTextContent(result[1].custom_text_content);
                setCustomJsonContent(result[1].custom_json_content);
                setIsCustomContentsLoading(false);
            });
        }
    }, [customItem, customContent, savedEngagement]);

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
