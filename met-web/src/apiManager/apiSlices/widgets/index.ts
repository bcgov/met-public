import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AppConfig } from 'config';
import { Widget } from 'models/widget';

// Define a service using a base URL and expected endpoints
export const widgetsApi = createApi({
    reducerPath: 'widgetsApi',
    baseQuery: fetchBaseQuery({ baseUrl: AppConfig.apiUrl }),
    endpoints: (builder) => ({
        getWidgets: builder.query<Widget[], number>({
            query: (engagement_id) => `widgets/engagement/${engagement_id}`,
            transformResponse: (response: { result: Widget[] }) => response.result || [],
        }),
    }),
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: 600,
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLazyGetWidgetsQuery } = widgetsApi;
