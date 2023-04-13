import React, { createContext, useState, useEffect } from 'react';
import { Engagement } from 'models/engagement';
import { getEngagements } from 'services/engagementService';
import { PAGE_SIZE } from './constants';

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
    totalEngagements: number;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
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
    totalEngagements: 0,
    page: 1,
    setPage: () => {
        throw new Error('setPage unimplemented');
    },
});

export const LandingContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [totalEngagements, setTotalEngagements] = useState(0);
    const [loadingEngagements, setLoadingEngagements] = useState(true);
    const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialSearchFilters);
    const [page, setPage] = useState(1);

    const loadEngagements = async () => {
        try {
            const { status, name, project_type } = searchFilters;
            const loadedEngagements = await getEngagements({
                page: page,
                size: PAGE_SIZE,
                sort_key: 'engagement.created_date',
                sort_order: 'desc',
                include_banner_url: true,
                engagement_status: status,
                search_text: name,
                project_type: project_type,
            });
            setEngagements(loadedEngagements.items);
            setTotalEngagements(loadedEngagements.total);
            setLoadingEngagements(false);
        } catch (error) {}
    };

    useEffect(() => {
        loadEngagements();
    }, [searchFilters, page]);

    return (
        <LandingContext.Provider
            value={{
                engagements,
                loadingEngagements,
                searchFilters,
                setSearchFilters,
                totalEngagements,
                page,
                setPage,
            }}
        >
            {children}
        </LandingContext.Provider>
    );
};
