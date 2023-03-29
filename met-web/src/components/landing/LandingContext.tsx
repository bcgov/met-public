import React, { createContext, useState, useEffect } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { Engagement } from 'models/engagement';
import { getEngagements } from 'services/engagementService';

interface SearchFilters {
    name: string;
    status: number[];
    project_type: string;
}
export interface LandingContextProps {
    engagements: Engagement[];
    loadingEngagements: boolean;
    searchFilters: SearchFilters;
    setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
}

const initialSearchFilters = {
    name: '',
    status: [],
    project_type: '',
};
export const LandingContext = createContext<LandingContextProps>({
    engagements: [],
    loadingEngagements: false,
    searchFilters: initialSearchFilters,
    setSearchFilters: () => {
        throw new Error('setSearchFilters unimplemented');
    },
});

export const LandingContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [loadingEngagements, setLoadingEngagements] = useState(true);
    const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialSearchFilters);

    const loadEngagements = async () => {
        try {
            const loadedEngagements = await getEngagements({
                page: 1,
                size: 50,
                sort_key: 'engagement.created_date',
                sort_order: 'desc',
                include_banner_url: true,
                engagement_status: searchFilters.status,
                search_text: searchFilters.name,
            });
            setEngagements(loadedEngagements.items);
            setLoadingEngagements(false);
        } catch (error) {}
    };

    useEffect(() => {
        loadEngagements();
    }, [searchFilters]);

    return (
        <LandingContext.Provider
            value={{
                engagements,
                loadingEngagements,
                searchFilters,
                setSearchFilters,
            }}
        >
            {children}
        </LandingContext.Provider>
    );
};
