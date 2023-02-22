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
import { Event } from 'models/event';
import { Box } from '@mui/material';
import { draftEngagement } from '../factory';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

const mockEvent: Event = {
    id: 1,
    name: 'Jace',
    title: 'prince',
    phone_number: '123-123-1234',
    email: 'jace@gmail.com',
    address: 'Dragonstone, Westeros',
    bio: 'Jacaerys Targaryen is the son and heir of Rhaenyra Targaryen',
    avatar_filename: '',
    avatar_url: '',
};

const contactWidgetItem: WidgetItem = {
    id: 1,
    widget_id: 1,
    widget_data_id: 1,
    sort_index: 1,
};

const whoIsListeningWidget: Widget = {
    id: 1,
    widget_type_id: WidgetType.WhoIsListening,
    engagement_id: 1,
    items: [contactWidgetItem],
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

const mockLazyGetEventsQuery = jest.fn(mockEventsRtkQuery);
const mockLazyGetEventQuery = jest.fn(mockEventRtkQuery);
jest.mock('apiManager/apiSlices/contacts', () => ({
    ...jest.requireActual('apiManager/apiSlices/contacts'),
    useLazyGetContactsQuery: () => [...mockLazyGetEventsQuery()],
    useLazyGetContactQuery: () => [...mockLazyGetEventQuery()],
}));

jest.mock('components/common/Dragdrop', () => ({
    ...jest.requireActual('components/common/Dragdrop'),
    MetDroppable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
    MetDraggable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

jest.mock('@hello-pangea/dnd', () => ({
    ...jest.requireActual('@hello-pangea/dnd'),
    DragDropContext: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

const mockWidgetsRtkUnwrap = jest.fn(() => Promise.resolve([whoIsListeningWidget]));
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

describe('Who is Listening widget  tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    const postWidgetMock = jest
        .spyOn(widgetService, 'postWidget')
        .mockReturnValue(Promise.resolve(whoIsListeningWidget));

    beforeEach(() => {
        setupEnv();
    });

    async function addWhosIsListeningWidget(container: HTMLElement) {
        await waitFor(() => {
            expect(screen.getByText('Add Widget')).toBeInTheDocument();
        });

        const addWidgetButton = screen.getByText('Add Widget');
        fireEvent.click(addWidgetButton);

        await waitFor(() => {
            expect(screen.getByText('Select Widget')).toBeVisible();
        });

        const whoIsListeningOption = screen.getByTestId(`widget-drawer-option/${WidgetType.WhoIsListening}`);
        fireEvent.click(whoIsListeningOption);

        await waitFor(() => {
            expect(screen.getByText('Add This Contact')).toBeVisible();
        });
    }

    test('Who is listening widget is created when option is clicked', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([]));
        postWidgetMock.mockReturnValue(Promise.resolve(whoIsListeningWidget));
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([whoIsListeningWidget]));
        const { container } = render(<EngagementForm />);

        await addWhosIsListeningWidget(container);

        expect(postWidgetMock).toHaveBeenNthCalledWith(1, draftEngagement.id, {
            widget_type_id: WidgetType.WhoIsListening,
            engagement_id: draftEngagement.id,
        });
        expect(mockWidgetsRtkUnwrap).toHaveBeenCalledTimes(2);
        expect(screen.getByText('Add This Contact')).toBeVisible();
        expect(screen.getByText('Select Existing Contact')).toBeVisible();
    });

    test('Add contact drawer appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );

        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([]));
        postWidgetMock.mockReturnValue(Promise.resolve(whoIsListeningWidget));
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([whoIsListeningWidget]));
        const { container } = render(<EngagementForm />);

        await addWhosIsListeningWidget(container);

        await waitFor(() => {
            expect(screen.getByText('Create New Contact')).toBeVisible();
            expect(screen.getByText(mockEvent.email)).toBeVisible();
        });

        const createContactButton = screen.getByText('Create New Contact');
        fireEvent.click(createContactButton);

        await waitFor(() => {
            expect(screen.getByText('Add Contact')).toBeVisible();
        });
    });
});
