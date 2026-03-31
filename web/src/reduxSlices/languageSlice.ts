import { createSlice } from '@reduxjs/toolkit';
import { AppConfig } from 'config';

export interface LanguageState {
    id: string;
    name: string;
    loading: boolean;
    isLoaded: boolean;
}

const initialState: LanguageState = {
    id: AppConfig.language.defaultLanguageId,
    name: AppConfig.language.defaultLanguageName,
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
            state.name = action.payload.name;
            state.isLoaded = true;
        },
    },
});

// Action creators are generated for each case reducer function
export const { saveLanguage, loadingLanguage } = languageSlice.actions;

export default languageSlice.reducer;
