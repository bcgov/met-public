import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalState } from './types';

const initialState: ModalState = {
    open: false,
    data: { header: '', subText: [], buttons: [{ buttonText: 'hello', buttonFunction: '' }] },
    type: '',
};

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state: ModalState, action: PayloadAction<ModalState>) => {
            state.open = true;
            state.data = action.payload.data;
            state.type = action.payload.type;
        },
        closeModal: (state: ModalState) => {
            state.open = false;
        },
    },
});

// Action creators are generated for each case reducer function
export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
