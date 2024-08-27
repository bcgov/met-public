import { SubmitHandler } from 'react-hook-form';
import { EngagementUpdateData } from './AuthoringContext';
import { Dispatch, SetStateAction } from 'react';

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
}

export interface LanguageSelectorProps {
    currentLanguage: string;
    setCurrentLanguage: Dispatch<SetStateAction<string>>;
}

export interface AuthoringBottomNavProps {
    isDirty: boolean;
    isValid: boolean;
    isSubmitting: boolean;
}
