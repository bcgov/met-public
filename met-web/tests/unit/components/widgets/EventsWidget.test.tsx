import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as widgetService from 'services/widgetService';
import { createDefaultSurvey, Survey } from 'models/survey';
import { Widget, WidgetItem, WidgetType } from 'models/widget';
import { Event, EventItem } from 'models/event';
import { Box } from '@mui/material';
import { draftEngagement } from '../factory';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

const mockEventItem: EventItem = {
    id: 1,
    description: 'description',
    location_name: 'location name',
    location_address: 'location address',
    start_date: 'start date',
    end_date: 'end date',
    url: 'link',
    url_label: 'link label',
    sort_index: 1,
    widget_events_id: 0,
    created_by: 'test',
    updated_by: 'test',
    created_date: 'test date',
    updated_date: 'test date',
};

const mockEvent: Event = {
    id: 1,
    title: 'Jace',
    type: 'OPENHOUSE',
    sort_index: 1,
    widget_id: 1,
    created_by: 'test',
    updated_by: 'test',
    event_items: [mockEventItem],
};

const eventWidgetItem: WidgetItem = {
    id: 1,
    widget_id: 1,
    widget_data_id: 1,
    sort_index: 1,
};

const eventWidget: Widget = {
    id: 1,
    widget_type_id: WidgetType.Events,
    engagement_id: 1,
    items: [eventWidgetItem],
};

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));

const mockEventsRtkUnwrap = jest.fn(() => Promise.resolve([mockEvent]));
const mockEventsRtkTrigger = () => {
    return {
        unwrap: mockEventsRtkUnwrap,
    };
};
export const mockEventsRtkQuery = () => [mockEventsRtkTrigger];

const mockEventRtkUnwrap = jest.fn(() => Promise.resolve(mockEvent));
const mockEventRtkTrigger = () => {
    return {
        unwrap: mockEventRtkUnwrap,
    };
};
export const mockEventRtkQuery = () => [mockEventRtkTrigger];

jest.mock('components/common/Dragdrop', () => ({
    ...jest.requireActual('components/common/Dragdrop'),
    MetDroppable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
    MetDraggable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

jest.mock('@hello-pangea/dnd', () => ({
    ...jest.requireActual('@hello-pangea/dnd'),
    DragDropContext: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

const mockWidgetsRtkUnwrap = jest.fn(() => Promise.resolve([eventWidget]));
const mockWidgetsRtkTrigger = () => {
    return {
        unwrap: mockWidgetsRtkUnwrap,
    };
};
export const mockWidgetsRtkQuery = () => [mockWidgetsRtkTrigger];

const mockLazyGetWidgetsQuery = jest.fn(mockWidgetsRtkQuery);
jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useLazyGetWidgetsQuery: () => [...mockLazyGetWidgetsQuery()],
}));

describe('Event Widget tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    const postWidgetMock = jest.spyOn(widgetService, 'postWidget').mockReturnValue(Promise.resolve(eventWidget));

    beforeEach(() => {
        setupEnv();
    });

    async function addEventWidget(container: HTMLElement) {
        await waitFor(() => {
            expect(screen.getByText('Add Widget')).toBeInTheDocument();
        });

        const addWidgetButton = screen.getByText('Add Widget');
        fireEvent.click(addWidgetButton);

        await waitFor(() => {
            expect(screen.getByText('Select Widget')).toBeVisible();
        });

        const eventOption = screen.getByTestId(`widget-drawer-option/${WidgetType.Events}`);
        fireEvent.click(eventOption);

        await waitFor(() => {
            expect(screen.getByText('Add In-Person Event')).toBeVisible();
            expect(screen.getByText('Add Virtual Session')).toBeVisible();
        });
    }

    test('Event widget is created when option is clicked', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([]));
        postWidgetMock.mockReturnValue(Promise.resolve(eventWidget));
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([eventWidget]));
        const { container } = render(<EngagementForm />);

        await addEventWidget(container);

        expect(postWidgetMock).toHaveBeenNthCalledWith(1, draftEngagement.id, {
            widget_type_id: WidgetType.Events,
            engagement_id: draftEngagement.id,
        });
        expect(mockWidgetsRtkUnwrap).toHaveBeenCalledTimes(2);
        expect(screen.getByText('Add In-Person Event')).toBeVisible();
        expect(screen.getByText('Add Virtual Session')).toBeVisible();
    });

    test('Add In-Person Event Drawer appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );

        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([]));
        postWidgetMock.mockReturnValue(Promise.resolve(eventWidget));
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([eventWidget]));
        const { container } = render(<EngagementForm />);

        await addEventWidget(container);

        await waitFor(() => {
            expect(screen.getByText('Add In-Person Event')).toBeVisible();
        });

        const InPersonEventButton = screen.getByText('Add In-Person Event');
        fireEvent.click(InPersonEventButton);

        await waitFor(() => {
            expect(screen.getByText('Description')).toBeVisible();
        });
    });

    test('Add Virtual Session Drawer appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );

        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([]));
        postWidgetMock.mockReturnValue(Promise.resolve(eventWidget));
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([eventWidget]));
        const { container } = render(<EngagementForm />);

        await addEventWidget(container);

        await waitFor(() => {
            expect(screen.getByText('Add Virtual Session')).toBeVisible();
        });

        const VirtualSessionButton = screen.getByText('Add Virtual Session');
        fireEvent.click(VirtualSessionButton);

        await waitFor(() => {
            expect(screen.getByText('Virtual Information Session')).toBeVisible();
        });
    });
});
