import React, { createContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableTranslations } from 'services/engagementService';

export interface LanguageContextType {
    engagementViewMounted: boolean;
    setEngagementViewMounted: (engagementViewMounted: boolean) => void;
    fetchAvailableEngagementTranslations: (engagementId: number) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
    engagementViewMounted: false,
    setEngagementViewMounted: (engagementViewMounted: boolean) => {
        /** Left intentionally blank */
    },
    fetchAvailableEngagementTranslations: (engagementId: number) => {
        /** Left intentionally blank */
    },
});

export const LanguageProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    // const navigate = useNavigate();
    const [engagementViewMounted, setEngagementViewMounted] = useState(false);
    const [availableEngagementTranslations, setAvailableEngagementTranslations] = useState([]);

    const fetchAvailableEngagementTranslations = async (engagementId: number) => {
        try {
            const result = await getAvailableTranslations(engagementId);
            console.log('');
            // setAvailableEngagementTranslations(result);
        } catch (error) {
            // navigate('/not-found');
        }
    };

    return (
        <LanguageContext.Provider
            value={{
                engagementViewMounted,
                setEngagementViewMounted,
                fetchAvailableEngagementTranslations,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};
