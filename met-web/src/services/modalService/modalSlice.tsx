import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationModalState } from './types';

const initialState: NotificationModalState = {
    open: false,
    data: { header: '', subText: [] },
    type: '',
};

export const notificationModalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state: NotificationModalState, action: PayloadAction<NotificationModalState>) => {
            state.open = true;
            state.data = action.payload.data;
            state.type = action.payload.type;
        },
        closeModal: (state: NotificationModalState) => {
            state.open = false;
        },
    },
});

// Action creators are generated for each case reducer function
export const { openModal, closeModal } = notificationModalSlice.actions;
export default notificationModalSlice.reducer;
