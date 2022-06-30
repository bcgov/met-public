export interface NotificationState {
    open: boolean;
    severity: AlertColor;
    text: string;
}

export interface OpenNotificationProps {
    severity: AlertColor;
    text: string;
}

export type AlertColor = 'success' | 'info' | 'warning' | 'error';
