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
    panelData?: SuccessPanelProps;
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
    mainText: string;
    subTextArray: string[];
    handleClose?: () => void;
    email: string;
}

export interface FailurePanelProps {
    tryAgain: () => void;
    handleClose: () => void;
    email: string;
}

export interface SurveyBlockProps {
    startSurvey: () => void;
}

export interface EngagementViewProps {
    open?: boolean;
    state: RouteState;
}

export interface RouteState {
    state: EngagementRouteProps | null;
}

export interface EngagementRouteProps {
    open: boolean;
    mainText: string;
    subTextArray: string[];
    email: string;
}

export const defaultPanelData = {
    mainText: 'We sent a link to access the survey at the following email address:',
    subTextArray: ['Please Click the link provided to access the survey.', 'The link will be valid for 24 hours.'],
    email: '',
};
