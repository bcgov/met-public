import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Props = {
    open: boolean;
    success: boolean;
    text: string;
    setOpen: any;
};

export const Notification: React.FC<Props> = ({ open, success, text, setOpen }) => {
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            {success ? (
                <>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        {text}
                    </Alert>
                </>
            ) : (
                <>
                    <Alert severity="error">{text}</Alert>
                </>
            )}
        </Snackbar>
    );
};
