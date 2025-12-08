import { SubmitHandler } from 'react-hook-form';
import { EngagementUpdateData } from './AuthoringContext';
import { Dispatch, SetStateAction } from 'react';
import { Language } from 'models/language';
import { Engagement } from 'models/engagement';
import { EditorState } from 'draft-js';
import { FetcherWithComponents } from 'react-router-dom';
import { EngagementDetailsTab } from 'models/engagementDetailsTab';

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
    currentLanguage: string;
    setCurrentLanguage: Dispatch<SetStateAction<string>>;
    languages: Language[];
    isDirty: boolean;
    isSubmitting: boolean;
}

export interface AuthoringBottomNavProps {
    currentLanguage: string;
    setCurrentLanguage: Dispatch<SetStateAction<string>>;
    languages: Language[];
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
}

export type FormDetailsTab = Omit<EngagementDetailsTab, 'body'> & {
    body: EditorState;
};
