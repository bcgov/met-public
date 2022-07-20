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
    handleClose: () => void;
    email: string;
}

export interface FailurePanelProps {
    tryAgain: () => void;
    handleClose: () => void;
    email: string;
}
