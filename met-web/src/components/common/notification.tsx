import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { closeNotification } from 'services/notificationService/notificationSlice';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Notification = () => {
    const dispatch = useAppDispatch();
    const open = useAppSelector((state) => state.notification.open);
    const severity = useAppSelector((state) => state.notification.severity);
    const text = useAppSelector((state) => state.notification.text);

    function handleClose() {
        dispatch(closeNotification());
    }

    return (
        <Snackbar data-testid="snackbar-notification" open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert data-testid="alert-notificaiton" onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {text}
            </Alert>
        </Snackbar>
    );
};
