import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState, OpenNotificationProps } from './types';

const initialState: NotificationState = {
    open: false,
    severity: 'success',
    text: '',
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        openNotification: (state: NotificationState, action: PayloadAction<OpenNotificationProps>) => {
            state.open = true;
            state.severity = action.payload.severity;
            state.text = action.payload.text;
        },
        closeNotification: (state: NotificationState) => {
            state.open = false;
        },
    },
});

// Action creators are generated for each case reducer function
export const { openNotification, closeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
