import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActionContext } from '../../ActionContext';
import { EngagementTabsContext } from '../EngagementTabsContext';

export interface EngagementContentProps {
    isEditMode: boolean;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EngagementContentContext = createContext<EngagementContentProps>({
    isEditMode: false,
    setIsEditMode: async () => {
        /* empty default method  */
    },
});

export const EngagementContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { contentTabs, savedEngagement } = useContext(ActionContext);
    const { engagementFormData, setEngagementFormData } = useContext(EngagementTabsContext);
    const [isEditMode, setIsEditMode] = useState(false);

    // Load the engagement's summary from the shared individual engagement loader and watch the summary item variable for any changes.
    useEffect(() => {
        if (!savedEngagement.id) {
            return;
        }
        if (savedEngagement && contentTabs) {
            setEngagementFormData({
                ...engagementFormData,
                content: contentTabs[0]?.json_content,
            });
        }
    }, [savedEngagement, contentTabs]);

    return (
        <EngagementContentContext.Provider
            value={{
                isEditMode,
                setIsEditMode,
            }}
        >
            {children}
        </EngagementContentContext.Provider>
    );
};
