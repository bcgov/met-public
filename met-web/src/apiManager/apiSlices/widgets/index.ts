import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AppConfig } from 'config';
import { Widget } from 'models/widget';

// Define a service using a base URL and expected endpoints
export const widgetsApi = createApi({
    reducerPath: 'widgetsApi',
    baseQuery: fetchBaseQuery({ baseUrl: AppConfig.apiUrl }),
    tagTypes: ['Widgets'],
    endpoints: (builder) => ({
        getWidgets: builder.query<Widget[], number>({
            query: (engagement_id) => `widgets/engagement/${engagement_id}`,
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Widgets' as const, id })), { type: 'Widgets', id: 'LIST' }]
                    : [{ type: 'Widgets', id: 'LIST' }],
        }),
        createWidget: builder.mutation<Widget, Partial<Widget>>({
            query: (widget) => ({
                url: 'widgets',
                method: 'POST',
                body: widget,
            }),
            invalidatesTags: ['Widgets'],
        }),
        updateWidget: builder.mutation<Widget, Partial<Widget>>({
            query: (widget) => ({
                url: `widgets/${widget.id}`,
                method: 'PATCH',
                body: widget,
            }),
            invalidatesTags: ['Widgets'],
        }),
        deleteWidget: builder.mutation<Widget, number>({
            query: (id) => ({
                url: `widgets/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Widgets'],
        }),
    }),
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: 600,
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLazyGetWidgetsQuery, useCreateWidgetMutation, useUpdateWidgetMutation, useDeleteWidgetMutation } =
    widgetsApi;
