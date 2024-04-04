import React, { createContext, useEffect, useState } from 'react';
import { PageInfo, PaginationOptions, createDefaultPageInfo } from 'components/common/Table/types';
import { useAppDispatch } from 'hooks';
import { Survey } from 'models/survey';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getSurveysPage } from 'services/surveyService';
import { useLocation } from 'react-router-dom';
import { updateURLWithPagination } from 'components/common/Table/utils';
import dayjs from 'dayjs';
import { formatToUTC } from 'components/common/dateHelper';

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
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pageFromURL = searchParams.get('page');
    const sizeFromURL = searchParams.get('size');
    const [searchText, setSearchText] = useState('');
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Survey>>({
        page: Number(pageFromURL) || 1,
        size: Number(sizeFromURL) || 10,
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

    const formatDates = (advancedSearchFilters: AdvancedSearchFilters) => {
        /*
                Database has the values in utc but the value we select from the calender is having only date without a time.
                So we need to convert:
                1) start dates to utc format 
                2) end dates to end of day and then to utc format
                (Followed the same impementation in Engagement Advanced Search)
        */
        const { createdDateFrom, createdDateTo, publishedDateFrom, publishedDateTo } = advancedSearchFilters;
        const formattedFilters = {
            ...advancedSearchFilters,
        };
        if (createdDateFrom) {
            formattedFilters.createdDateFrom = formatToUTC(createdDateFrom);
        }
        if (createdDateTo) {
            formattedFilters.createdDateTo = formatToUTC(
                dayjs(createdDateTo).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            );
        }
        if (publishedDateFrom) {
            formattedFilters.publishedDateFrom = formatToUTC(publishedDateFrom);
        }
        if (publishedDateTo) {
            formattedFilters.publishedDateTo = formatToUTC(
                dayjs(publishedDateTo).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            );
        }

        return formattedFilters;
    };

    const loadSurveys = async () => {
        try {
            setTableLoading(true);
            const dateFilters = formatDates(advancedSearchFilters);
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
                created_date_from: dateFilters.createdDateFrom,
                created_date_to: dateFilters.createdDateTo,
                published_date_from: dateFilters.publishedDateFrom,
                published_date_to: dateFilters.publishedDateTo,
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
        updateURLWithPagination(paginationOptions);
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
