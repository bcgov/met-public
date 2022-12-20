import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AppConfig } from 'config';
import { Contact } from 'models/contact';

// Define a service using a base URL and expected endpoints
export const contactsApi = createApi({
    reducerPath: 'contactsApi',
    baseQuery: fetchBaseQuery({ baseUrl: AppConfig.apiUrl }),
    endpoints: (builder) => ({
        getContacts: builder.query<Contact[], void>({
            query: () => `contacts/`,
        }),
        getContact: builder.query<Contact, number>({
            query: (contact_id) => `contacts/${contact_id}`,
        }),
    }),
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: 600,
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLazyGetContactsQuery, useLazyGetContactQuery } = contactsApi;
