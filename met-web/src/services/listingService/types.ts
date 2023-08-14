import { PaginationOptions } from 'components/common/Table/types';
import { Engagement } from 'models/engagement';
import { Survey } from 'models/survey';
import { Feedback } from 'models/feedback';
import { User } from 'models/user';
export type AllModels = Engagement | Feedback | User | Survey;

interface TableState<T> {
    pagination: PaginationOptions<T>;
}

interface AllTableStates {
    engagement: TableState<Engagement>;
    feedback: TableState<Feedback>;
    user_management: TableState<User>;
    survey: TableState<Survey>;
}

const defaultSurveyPaginationOptions: PaginationOptions<Survey> = {
    page: 1,
    size: 10,
    sort_key: 'created_date',
    nested_sort_key: 'survey.created_date',
    sort_order: 'desc',
};

const defaultEngagementPaginationOptions: PaginationOptions<Engagement> = {
    page: 1,
    size: 10,
    sort_key: 'created_date',
    nested_sort_key: 'engagement.created_date',
    sort_order: 'desc',
};

const defaultFeedbackPaginationOptions: PaginationOptions<Feedback> = {
    page: 1,
    size: 10,
    sort_key: 'rating',
    nested_sort_key: null,
    sort_order: 'asc',
};

const defaultUserManagementPaginationOptions: PaginationOptions<User> = {
    page: 1,
    size: 10,
    sort_key: 'first_name',
    nested_sort_key: 'first_name',
    sort_order: 'asc',
};

export {
    AllTableStates,
    defaultSurveyPaginationOptions,
    defaultEngagementPaginationOptions,
    defaultFeedbackPaginationOptions,
    defaultUserManagementPaginationOptions,
};
