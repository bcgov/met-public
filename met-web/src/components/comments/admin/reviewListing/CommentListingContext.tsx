import { PageInfo, PaginationOptions } from 'components/common/Table/types';
import { CommentStatus } from 'constants/commentStatus';
import { useAppDispatch } from 'hooks';
import { Survey, createDefaultSurvey } from 'models/survey';
import { SurveySubmission } from 'models/surveySubmission';
import React, { createContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getSubmissionPage } from 'services/submissionService';
import { getSurvey } from 'services/surveyService';

export interface AdvancedSearchFilters {
    status: CommentStatus | null;
    commentDateFrom: string;
    commentDateTo: string;
    reviewer: string;
    reviewedDateFrom: string;
    reviewedDateTo: string;
}
export const initialSearchFilters: AdvancedSearchFilters = {
    status: null,
    commentDateFrom: '',
    commentDateTo: '',
    reviewer: '',
    reviewedDateFrom: '',
    reviewedDateTo: '',
};

export interface CommentListingContextState {
    searchFilter: {
        key: string;
        value: string;
    };
    advancedSearchFilters: AdvancedSearchFilters;
    setAdvancedSearchFilters: (value: AdvancedSearchFilters) => void;
    setSearchFilter: (value: { key: string; value: string }) => void;
    searchText: string;
    setSearchText: (value: string) => void;
    survey: Survey;
    submissions: SurveySubmission[];
    paginationOptions: PaginationOptions<SurveySubmission>;
    setPagination: (value: PaginationOptions<SurveySubmission>) => void;
    pageInfo: PageInfo;
    setPageInfo: (value: PageInfo) => void;
    loading: boolean;
    loadSubmissions: () => void;
}

export const CommentListingContext = createContext<CommentListingContextState>({
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
    survey: createDefaultSurvey(),
    submissions: [],
    paginationOptions: {
        page: 1,
        size: 10,
        sort_key: 'id',
        nested_sort_key: 'submission.id',
        sort_order: 'desc',
    },
    setPagination: () => {
        throw new Error('setPagination not implemented');
    },
    pageInfo: {
        total: 0,
    },
    setPageInfo: () => {
        throw new Error('setPageInfo not implemented');
    },
    loading: true,
    loadSubmissions: () => {
        throw new Error('loadSubmissions not implemented');
    },
});

interface CommentListingContextProviderProps {
    children: React.ReactNode;
}
export const CommentListingContextProvider = ({ children }: CommentListingContextProviderProps) => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'id',
        value: '',
    });
    const [advancedSearchFilters, setAdvancedSearchFilters] = useState<AdvancedSearchFilters>(initialSearchFilters);
    const [searchText, setSearchText] = useState('');
    const [survey, setSurvey] = useState<Survey>(createDefaultSurvey());
    const [submissions, setSubmissions] = useState<SurveySubmission[]>([]);
    const [paginationOptions, setPagination] = useState<PaginationOptions<SurveySubmission>>({
        page: 1,
        size: 10,
        sort_key: 'id',
        nested_sort_key: 'submission.id',
        sort_order: 'desc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        total: 0,
    });
    const [loading, setLoading] = useState(true);

    const { surveyId } = useParams();

    const dispatch = useAppDispatch();

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const loadSurvey = async () => {
        try {
            const survey = await getSurvey(Number(surveyId));
            setSurvey(survey);
        } catch (error) {
            console.log(error);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching survey information' }));
            setLoading(false);
        }
    };

    const loadSubmissions = async () => {
        try {
            setLoading(true);
            const response = await getSubmissionPage({
                survey_id: Number(surveyId),
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                search_text: searchFilter.value,
                status: advancedSearchFilters.status || undefined,
                comment_date_from: advancedSearchFilters.commentDateFrom,
                comment_date_to: advancedSearchFilters.commentDateTo,
                reviewer: advancedSearchFilters.reviewer,
                reviewed_date_from: advancedSearchFilters.reviewedDateFrom,
                reviewed_date_to: advancedSearchFilters.reviewedDateTo,
            });
            setSubmissions(response.items);
            setPageInfo({
                total: response.total,
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching submissions' }));
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isNaN(Number(surveyId))) {
            dispatch(openNotification({ severity: 'error', text: 'Invalid surveyId' }));
            return;
        }

        loadSurvey();
        loadSubmissions();
    }, [surveyId, paginationOptions, searchFilter, advancedSearchFilters]);

    return (
        <CommentListingContext.Provider
            value={{
                searchFilter,
                setSearchFilter,
                advancedSearchFilters,
                setAdvancedSearchFilters,
                searchText,
                setSearchText,
                survey,
                submissions,
                paginationOptions,
                setPagination,
                pageInfo,
                setPageInfo,
                loading,
                loadSubmissions,
            }}
        >
            {children}
        </CommentListingContext.Provider>
    );
};
