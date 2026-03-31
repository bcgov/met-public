import { configureStore } from '@reduxjs/toolkit';
import loginReducer from 'components/Login/loginSlice';
import userSlice from 'services/userService/userSlice';
import engagementSlice from 'services/engagementService/engagementSlice';
import notificationSlice from 'services/notificationService/notificationSlice';
import notificationModalSlice from 'services/notificationModalService/notificationModalSlice';
import { widgetsApi } from 'apiManager/apiSlices/widgets';
import { setupListeners } from '@reduxjs/toolkit/query';
import { contactsApi } from 'apiManager/apiSlices/contacts';
import { documentsApi } from 'apiManager/apiSlices/documents';
import tenantSlice from 'reduxSlices/tenantSlice';
import languageSlice from 'reduxSlices/languageSlice';

export const store = configureStore({
    reducer: {
        auth: loginReducer,
        user: userSlice,
        tenant: tenantSlice,
        language: languageSlice,
        engagement: engagementSlice,
        notification: notificationSlice,
        notificationModal: notificationModalSlice,
        [widgetsApi.reducerPath]: widgetsApi.reducer,
        [contactsApi.reducerPath]: contactsApi.reducer,
        [documentsApi.reducerPath]: documentsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
            .concat(widgetsApi.middleware)
            .concat(contactsApi.middleware)
            .concat(documentsApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
