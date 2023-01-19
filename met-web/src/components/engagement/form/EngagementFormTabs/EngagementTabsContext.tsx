import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActionContext } from '../ActionContext';

interface EngagementFormData {
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    content: string;
}

const initialEngagementFormData = {
    name: '',
    start_date: '',
    end_date: '',
    description: '',
    content: '',
};

interface EngagementFormError {
    name: boolean;
    start_date: boolean;
    end_date: boolean;
}

const initialFormError = {
    name: false,
    start_date: false,
    end_date: false,
};
export interface EngagementTabsContextState {
    engagementFormData: EngagementFormData;
    setEngagementFormData: React.Dispatch<React.SetStateAction<EngagementFormData>>;
    richDescription: string;
    setRichDescription: React.Dispatch<React.SetStateAction<string>>;
    richContent: string;
    setRichContent: React.Dispatch<React.SetStateAction<string>>;
    engagementFormError: EngagementFormError;
    setEngagementFormError: React.Dispatch<React.SetStateAction<EngagementFormError>>;
    upcomingText: string;
    setUpcomingText: React.Dispatch<React.SetStateAction<string>>;
    openText: string;
    setOpenText: React.Dispatch<React.SetStateAction<string>>;
    closedText: string;
    setClosedText: React.Dispatch<React.SetStateAction<string>>;
}

export const EngagementTabsContext = createContext<EngagementTabsContextState>({
    engagementFormData: initialEngagementFormData,
    setEngagementFormData: () => {
        throw new Error('setEngagementFormData is unimplemented');
    },
    richDescription: '',
    setRichDescription: () => {
        throw new Error('setRichDescription is unimplemented');
    },
    richContent: '',
    setRichContent: () => {
        throw new Error('setRichContent is unimplemented');
    },
    engagementFormError: initialFormError,
    setEngagementFormError: () => {
        throw new Error('setEngagementFormError is unimplemented');
    },
    upcomingText: '',
    setUpcomingText: () => {
        throw new Error('setUpcomingText is unimplemented');
    },
    openText: '',
    setOpenText: () => {
        throw new Error('setOpenText is unimplemented');
    },
    closedText: '',
    setClosedText: () => {
        throw new Error('setClosedText is unimplemented');
    },
});

export const EngagementTabsContextProvider = ({ children }: { children: JSX.Element }) => {
    const { savedEngagement } = useContext(ActionContext);
    const [engagementFormData, setEngagementFormData] = useState<EngagementFormData>(initialEngagementFormData);
    const [richDescription, setRichDescription] = useState('');
    const [richContent, setRichContent] = useState('');
    const [engagementFormError, setEngagementFormError] = useState<EngagementFormError>(initialFormError);

    // Add survey block
    const [upcomingText, setUpcomingText] = useState('');
    const [openText, setOpenText] = useState('');
    const [closedText, setClosedText] = useState('');

    useEffect(() => {
        setEngagementFormData({
            name: savedEngagement?.name || '',
            start_date: savedEngagement.start_date,
            end_date: savedEngagement.end_date,
            description: savedEngagement?.description || '',
            content: savedEngagement?.content || '',
        });
        setRichDescription(savedEngagement?.rich_description || '');
        setRichContent(savedEngagement?.rich_content || '');
    }, [savedEngagement]);
    return (
        <EngagementTabsContext.Provider
            value={{
                engagementFormData,
                setEngagementFormData,
                richDescription,
                setRichDescription,
                richContent,
                setRichContent,
                engagementFormError,
                setEngagementFormError,
                upcomingText,
                setUpcomingText,
                openText,
                setOpenText,
                closedText,
                setClosedText,
            }}
        >
            {children}
        </EngagementTabsContext.Provider>
    );
};
