import { createSlice } from '@reduxjs/toolkit';

export interface TenantState {
    id: string;
    name: string;
    logoUrl: string;
    basename: string;
    loading: boolean;
    isLoaded: boolean;
}
const initialState: TenantState = {
    id: '',
    name: '',
    logoUrl: '',
    basename: '',
    loading: true,
    isLoaded: false,
};

export const userSlice = createSlice({
    name: 'tenant',
    initialState,
    reducers: {
        loadingTenant: (state, action) => {
            state.loading = action.payload;
        },
        saveTenant: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.logoUrl = action.payload.logoUrl || '';
            state.basename = action.payload.basename;
            state.isLoaded = true;
        },
    },
});

// Action creators are generated for each case reducer function
export const { saveTenant, loadingTenant } = userSlice.actions;

export default userSlice.reducer;
