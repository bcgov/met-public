import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AppConfig } from 'config';
import { Widget } from 'models/widget';
import { prepareHeaders } from 'apiManager//apiSlices/util';

// Define a service using a base URL and expected endpoints
export const widgetsApi = createApi({
    reducerPath: 'widgetsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: AppConfig.apiUrl,
        prepareHeaders,
    }),
    tagTypes: ['Widgets'],
    endpoints: (builder) => ({
        getWidgets: builder.query<Widget[], number>({
            query: (engagement_id) => `widgets/engagement/${engagement_id}`,
            providesTags: (result) =>
                result ? [...result.map(({ id }) => ({ type: 'Widgets' as const, id })), 'Widgets'] : ['Widgets'],
        }),
        createWidget: builder.mutation<Widget, Partial<Widget>>({
            query: (widget) => ({
                url: `widgets/engagement/${widget.engagement_id}`,
                method: 'POST',
                body: widget,
            }),
            invalidatesTags: ['Widgets'],
        }),
        sortWidgets: builder.mutation<Widget, { engagementId: number; widgets: Widget[] }>({
            query: ({ engagementId, widgets }) => ({
                url: `widgets/engagement/${engagementId}/sort_index`,
                method: 'PATCH',
                body: widgets,
            }),
            invalidatesTags: ['Widgets'],
        }),
        deleteWidget: builder.mutation<Widget, { engagementId: number; widgetId: number }>({
            query: ({ engagementId, widgetId }) => ({
                url: `widgets/engagement/${engagementId}/widget/${widgetId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Widgets', id: arg.widgetId }],
        }),
    }),
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: 60000,
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLazyGetWidgetsQuery, useCreateWidgetMutation, useSortWidgetsMutation, useDeleteWidgetMutation } =
    widgetsApi;
