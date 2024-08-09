import { Engagement } from 'models/engagement';
import React from 'react';

export interface BannerProps {
    imageUrl?: string;
    height?: string;
    children?: JSX.Element | JSX.Element[];
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
    engagement?: Engagement;
}

export interface EmailPanelProps {
    email: string;
    checkEmail: () => void;
    handleClose: () => void;
    updateEmail: (string: string) => void;
    isSaving: boolean;
    isInternal: boolean;
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
    isInternal: boolean;
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
