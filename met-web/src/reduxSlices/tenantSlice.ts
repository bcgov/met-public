import { createSlice } from '@reduxjs/toolkit';

export interface TenantState {
    name: string;
    logoUrl: string;
    basename: string;
    loading: boolean;
}
const initialState: TenantState = {
    name: '',
    logoUrl: '',
    basename: '',
    loading: true,
};

export const userSlice = createSlice({
    name: 'tenant',
    initialState,
    reducers: {
        loadingTenant: (state, action) => {
            state.loading = action.payload;
        },
        saveTenant: (state, action) => {
            state.name = action.payload.name;
            state.logoUrl = action.payload.logoUrl || '';
            state.basename = action.payload.basename;
        },
    },
});

// Action creators are generated for each case reducer function
export const { saveTenant, loadingTenant } = userSlice.actions;

export default userSlice.reducer;
