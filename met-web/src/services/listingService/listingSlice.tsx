import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaginationOptions } from 'components/common/Table/types';
import {
    AllTableStates,
    defaultSurveyPaginationOptions,
    defaultEngagementPaginationOptions,
    defaultFeedbackPaginationOptions,
    defaultUserManagementPaginationOptions,
    AllModels,
} from './types';

const initialState: AllTableStates = {
    engagement: { pagination: defaultEngagementPaginationOptions },
    survey: {
        pagination: defaultSurveyPaginationOptions,
    },
    feedback: { pagination: defaultFeedbackPaginationOptions },
    user_management: { pagination: defaultUserManagementPaginationOptions },
};

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        setTablePagination: (
            state,
            action: PayloadAction<{
                tableName: keyof AllTableStates;
                pagination: PaginationOptions<AllModels>;
            }>,
        ) => {
            const { tableName, pagination } = action.payload;
            state[tableName].pagination = pagination;
        },
    },
});

export const { setTablePagination } = tableSlice.actions;
export default tableSlice.reducer;
