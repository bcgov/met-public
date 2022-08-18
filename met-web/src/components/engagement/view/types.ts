import { Engagement } from 'models/engagement';

export interface BannerProps {
    savedEngagement: Engagement;
    children?: JSX.Element;
}

export interface EngagementBannerProps {
    startSurvey: () => void;
}

export interface EmailModalProps {
    open: boolean;
    handleClose: () => void;
    defaultPanel: string;
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
