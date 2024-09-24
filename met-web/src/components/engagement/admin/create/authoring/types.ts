import { Control, SubmitHandler, UseFormGetValues, UseFormReset, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { EngagementUpdateData } from './AuthoringContext';
import { Dispatch, SetStateAction } from 'react';
import { Language } from 'models/language';
import { Engagement } from 'models/engagement';
import { EditorState } from 'draft-js';
import { FetcherWithComponents } from 'react-router-dom';

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
    isDirty: boolean;
    isValid: boolean;
    isSubmitting: boolean;
    currentLanguage: string;
    setCurrentLanguage: Dispatch<SetStateAction<string>>;
    languages: Language[];
    pageTitle: string;
    setValue: UseFormSetValue<EngagementUpdateData>;
}

export interface StatusLabelProps {
    text: string;
    completed: boolean;
}

export interface AuthoringTemplateOutletContext {
    setValue: UseFormSetValue<EngagementUpdateData>;
    getValues: UseFormGetValues<EngagementUpdateData>;
    watch: UseFormWatch<EngagementUpdateData>;
    control: Control<EngagementUpdateData, object>;
    engagement: Engagement;
    isDirty: boolean;
    reset: UseFormReset<EngagementUpdateData>;
    defaultValues: EngagementUpdateData;
    setDefaultValues: Dispatch<SetStateAction<EngagementUpdateData>>;
    fetcher: FetcherWithComponents<object>;
    pageName: string;
    contentTabsEnabled: string;
    tabs: TabValues[];
    setTabs: Dispatch<SetStateAction<TabValues[]>>;
    setSingleContentValues: Dispatch<SetStateAction<TabValues>>;
    setContentTabsEnabled: Dispatch<SetStateAction<string>>;
    singleContentValues: TabValues;
    defaultTabValues: TabValues;
}

export interface DetailsTabProps {
    setValue: UseFormSetValue<EngagementUpdateData>;
    setTabs: Dispatch<SetStateAction<TabValues[]>>;
    setCurrentTab: Dispatch<SetStateAction<TabValues>>;
    setSingleContentValues: Dispatch<SetStateAction<TabValues>>;
    tabs: TabValues[];
    tabIndex: number;
    singleContentValues: TabValues;
    defaultTabValues: TabValues;
}

export interface TabValues {
    heading: string;
    bodyCopyPlainText: string;
    bodyCopyEditorState: EditorState;
    widget: string;
}
