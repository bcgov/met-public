import { SubmitHandler } from 'react-hook-form';
import { EngagementUpdateData } from './AuthoringContext';
import { Dispatch, SetStateAction } from 'react';
import { Language } from 'models/language';
import { Engagement } from 'models/engagement';
import { EditorState } from 'draft-js';
import { FetcherWithComponents } from 'react-router-dom';
import { EngagementDetailsTab } from 'models/engagementDetailsTab';
import { LanguageState } from 'reduxSlices/languageSlice';

export interface AuthoringNavProps {
    open: boolean;
    isMediumScreen: boolean;
    setOpen: (open: boolean) => void;
    engagementId: string;
}

export interface DrawerBoxProps {
    isMediumScreenOrLarger: boolean;
    setOpen: (open: boolean) => void;
    engagementId: string;
}

export interface AuthoringContextType {
    onSubmit: SubmitHandler<EngagementUpdateData>;
    defaultValues: EngagementUpdateData;
    setDefaultValues: Dispatch<SetStateAction<EngagementUpdateData>>;
    fetcher: FetcherWithComponents<object>;
}

export interface LanguageSelectorProps {
    currentLanguage: LanguageState;
    setCurrentLanguage: (code: string, name: string) => void;
    languages: Promise<Language[]>;
    isDirty: boolean;
    isSubmitting: boolean;
}

export interface AuthoringBottomNavProps {
    currentLanguage: LanguageState;
    setCurrentLanguage: (code: string, name: string) => void;
    languages: Promise<Language[]>;
    pageTitle: string;
    pageName: string;
}

export interface StatusLabelProps {
    text: string;
    completed: boolean;
}

export interface AuthoringTemplateOutletContext {
    engagement: Engagement;
    defaultValues: EngagementUpdateData;
    setDefaultValues: Dispatch<SetStateAction<EngagementUpdateData>>;
    fetcher: FetcherWithComponents<object>;
    pageName: string;
    tenantId: number;
}

export type FormDetailsTab = Omit<EngagementDetailsTab, 'body'> & {
    body: EditorState;
};
