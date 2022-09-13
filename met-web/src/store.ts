import { configureStore } from '@reduxjs/toolkit';
import loginReducer from 'components/Login/loginSlice';
import userSlice from 'services/userService/userSlice';
import { form, submission } from '@formio/react';
import engagementSlice from 'services/engagementService/engagementSlice';
import notificationSlice from 'services/notificationService/notificationSlice';
import notificationModalSlice from 'services/modalService/modalSlice';

export const store = configureStore({
    reducer: {
        auth: loginReducer,
        user: userSlice,
        engagement: engagementSlice,
        notification: notificationSlice,
        notificationModal: notificationModalSlice,
        form: form({ name: 'form' }),
        submission: submission({ name: 'submission' }),
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
