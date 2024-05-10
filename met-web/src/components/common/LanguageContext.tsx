import React, { createContext, useState } from 'react';
import { Language } from 'models/language';

export interface LanguageContextType {
    engagementViewMounted: boolean;
    availableEngagementTranslations: Language[];
    setEngagementViewMounted: (engagementViewMounted: boolean) => void;
    setAvailableEngagementTranslations: (languages: Language[]) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
    engagementViewMounted: false,
    availableEngagementTranslations: [],
    setEngagementViewMounted: (engagementViewMounted: boolean) => {
        /** Left intentionally blank */
    },
    setAvailableEngagementTranslations: (languages: Language[]) => {
        /** Left intentionally blank */
    },
});

export const LanguageProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const [engagementViewMounted, setEngagementViewMounted] = useState(false);
    const [availableEngagementTranslations, setAvailableEngagementTranslations] = useState<Language[]>([]);

    return (
        <LanguageContext.Provider
            value={{
                engagementViewMounted,
                availableEngagementTranslations,
                setEngagementViewMounted,
                setAvailableEngagementTranslations,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};
