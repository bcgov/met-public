import { createSlice } from '@reduxjs/toolkit';

export interface TenantState {
    id: string;
    name: string;
    logoUrl: string;
    basename: string;
    loading: boolean;
    isLoaded: boolean;
    title: string;
    contact_email: string;
    contact_name: string;
    description: string;
    short_name: string;
    logo_description: string;
    logo_credit: string;
}
const initialState: TenantState = {
    id: '',
    name: '',
    logoUrl: '',
    basename: '',
    loading: true,
    isLoaded: false,
    title: '',
    contact_email: '',
    contact_name: '',
    description: '',
    short_name: '',
    logo_description: '',
    logo_credit: '',
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
            state.title = action.payload.title;
            state.contact_email = action.payload.contact_email;
            state.contact_name = action.payload.contact_name;
            state.description = action.payload.description;
            state.short_name = action.payload.short_name;
            state.logo_description = action.payload.logo_description;
            state.logo_credit = action.payload.logo_credit;
        },
    },
});

// Action creators are generated for each case reducer function
export const { saveTenant, loadingTenant } = userSlice.actions;

export default userSlice.reducer;
