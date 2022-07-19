import { Engagement } from 'models/engagement';

export interface EngagementBannerProps {
    savedEngagement: Engagement;
    children?: JSX.Element;
}

export interface EmailModalProps {
    open: boolean;
    handleClose: () => void;
}

export interface EmailPanelProps {
    email: string;
    checkEmail: () => void;
    handleClose: () => void;
    updateEmail: (string: string) => void;
}

export interface SuccessPanelProps {
    open: boolean;
    handleClose: () => void;
    email: string;
}

export interface FailurePanelProps {
    open: boolean;
    tryAgain: () => void;
    handleClose: () => void;
    email: string;
}
