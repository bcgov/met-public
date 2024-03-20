import { createSlice } from '@reduxjs/toolkit';
import { AppConfig } from 'config';

export interface LanguageState {
    id: string;
    loading: boolean;
    isLoaded: boolean;
}

const initialState: LanguageState = {
    id: AppConfig.language.defaultLanguageId,
    loading: true,
    isLoaded: false,
};

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        loadingLanguage: (state, action) => {
            state.loading = action.payload;
        },
        saveLanguage: (state, action) => {
            state.id = action.payload.id;
            state.isLoaded = true;
        },
    },
});

// Action creators are generated for each case reducer function
export const { saveLanguage, loadingLanguage } = languageSlice.actions;

export default languageSlice.reducer;
