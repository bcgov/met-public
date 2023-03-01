import React from 'react';

export interface BannerProps {
    imageUrl?: string;
    children?: JSX.Element | JSX.Element[];
}

export interface EngagementBannerProps {
    startSurvey: () => void;
}

export interface EmailModalProps {
    open: boolean;
    defaultPanel: string;
    header?: string;
    subText?: string;
    email?: string;
    termsOfService?: string | React.ReactFragment;
    handleConfirm?: () => void;
    handleClose: () => void;
    updateEmail?: (email: string) => void;
    updateModal?: (open: boolean) => void;
}

export interface EmailPanelProps {
    email: string;
    checkEmail: () => void;
    handleClose: () => void;
    updateEmail: (string: string) => void;
    isSaving: boolean;
}

export interface SuccessPanelProps {
    handleClose: () => void;
    email: string;
}

export interface ThankYouPanelProps {
    handleClose?: () => void;
}

export interface FailurePanelProps {
    tryAgain: () => void;
    handleClose: () => void;
    email: string;
}

export interface SurveyBlockProps {
    startSurvey: () => void;
}

export interface RouteState {
    state: EngagementRouteProps | null;
}

export interface EngagementRouteProps {
    open: boolean;
}
