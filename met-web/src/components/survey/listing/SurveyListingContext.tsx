import React, { createContext, useEffect, useState } from 'react';
import { PageInfo, PaginationOptions, createDefaultPageInfo } from 'components/common/Table/types';
import { useAppDispatch } from 'hooks';
import { Survey } from 'models/survey';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getSurveysPage } from 'services/surveyService';

interface SurveyFilterStatus {
    linked: boolean;
    ready: boolean;
    template: boolean;
    hidden: boolean;
}
export interface AdvancedSearchFilters {
    status: SurveyFilterStatus;
    createdDateFrom: string;
    createdDateTo: string;
    publishedDateFrom: string;
    publishedDateTo: string;
}
export const initialSearchFilters: AdvancedSearchFilters = {
    status: {
        linked: false,
        ready: false,
        template: false,
        hidden: false,
    },
    createdDateFrom: '',
    createdDateTo: '',
    publishedDateFrom: '',
    publishedDateTo: '',
};

export interface SurveyListingContextState {
    searchFilter: {
        key: string;
        value: string;
    };
    advancedSearchFilters: AdvancedSearchFilters;
    setAdvancedSearchFilters: (value: AdvancedSearchFilters) => void;
    setSearchFilter: (value: { key: string; value: string }) => void;
    searchText: string;
    setSearchText: (value: string) => void;
    paginationOptions: PaginationOptions<Survey>;
    setPaginationOptions: (value: PaginationOptions<Survey>) => void;
    pageInfo: PageInfo;
    setPageInfo: (value: PageInfo) => void;
    tableLoading: boolean;
    surveys: Survey[];
    initialSearchFilters: AdvancedSearchFilters;
}

export const SurveyListingContext = createContext<SurveyListingContextState>({
    searchFilter: {
        key: 'id',
        value: '',
    },
    advancedSearchFilters: initialSearchFilters,
    setAdvancedSearchFilters: () => {
        throw new Error('setAdvancedSearchFilters not implemented');
    },
    setSearchFilter: () => {
        throw new Error('setSearchFilter not implemented');
    },
    searchText: '',
    setSearchText: () => {
        throw new Error('setSearchText not implemented');
    },
    paginationOptions: {
        page: 1,
        size: 10,
        sort_key: 'created_date',
        nested_sort_key: 'survey.created_date',
        sort_order: 'desc',
    },
    setPaginationOptions: () => {
        throw new Error('setPaginationOptions not implemented');
    },
    pageInfo: createDefaultPageInfo(),
    setPageInfo: () => {
        throw new Error('setPageInfo not implemented');
    },
    tableLoading: false,
    surveys: [],
    initialSearchFilters: initialSearchFilters,
});

interface SurveyListingContextProviderProps {
    children: React.ReactNode;
}
export const SurveyListingContextProvider = ({ children }: SurveyListingContextProviderProps) => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'name',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Survey>>({
        page: 1,
        size: 10,
        sort_key: 'created_date',
        nested_sort_key: 'survey.created_date',
        sort_order: 'desc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());

    const [tableLoading, setTableLoading] = useState(true);

    const [advancedSearchFilters, setAdvancedSearchFilters] = useState<AdvancedSearchFilters>({
        ...initialSearchFilters,
    });

    const dispatch = useAppDispatch();

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const loadSurveys = async () => {
        try {
            setTableLoading(true);
            const response = await getSurveysPage({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                search_text: searchFilter.value,
                is_unlinked: advancedSearchFilters.status.ready,
                is_template: advancedSearchFilters.status.template,
                is_hidden: advancedSearchFilters.status.hidden,
                is_linked: advancedSearchFilters.status.linked,
                created_date_from: advancedSearchFilters.createdDateFrom,
                created_date_to: advancedSearchFilters.createdDateTo,
                published_date_from: advancedSearchFilters.publishedDateFrom,
                published_date_to: advancedSearchFilters.publishedDateTo,
            });
            setSurveys(response.items);
            setPageInfo({
                total: response.total,
            });
            setTableLoading(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching surveys' }));
            setTableLoading(false);
        }
    };

    useEffect(() => {
        loadSurveys();
    }, [paginationOptions, searchFilter, advancedSearchFilters]);

    return (
        <SurveyListingContext.Provider
            value={{
                searchFilter,
                setSearchFilter,
                searchText,
                setSearchText,
                paginationOptions,
                setPaginationOptions,
                pageInfo,
                setPageInfo,
                tableLoading,
                advancedSearchFilters,
                setAdvancedSearchFilters,
                surveys,
                initialSearchFilters,
            }}
        >
            {children}
        </SurveyListingContext.Provider>
    );
};
