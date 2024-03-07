import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as widgetService from 'services/widgetService';
import * as engagementMetadataService from 'services/engagementMetadataService';
import * as membershipService from 'services/membershipService';
import * as engagementSettingService from 'services/engagementSettingService';
import { Box } from '@mui/material';
import { WidgetType } from 'models/widget';
import { draftEngagement, surveys, mockEvent, eventWidget, engagementMetadata } from '../factory';
import { USER_ROLES } from 'services/userService/constants';
import { EngagementSettings, createDefaultEngagementSettings } from 'models/engagement';

jest.mock('components/map', () => () => {
    return <div></div>;
});

const mockEngagementSettings: EngagementSettings = {
    ...createDefaultEngagementSettings(),
};

jest.mock('axios');

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => {
        return {
            roles: [USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS, USER_ROLES.EDIT_ENGAGEMENT, USER_ROLES.CREATE_ENGAGEMENT],
            assignedEngagements: [draftEngagement.id],
        };
    }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ search: '' })),
    useParams: jest.fn(() => {
        return { projectId: '' };
    }),
    useNavigate: () => jest.fn(),
}));

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

const mockCreateWidget = jest.fn(() => Promise.resolve(eventWidget));
jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useCreateWidgetMutation: () => [mockCreateWidget],
    useUpdateWidgetMutation: () => [jest.fn(() => Promise.resolve(eventWidget))],
    useDeleteWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useSortWidgetsMutation: () => [jest.fn(() => Promise.resolve())],
}));

describe('Event Widget tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    const getWidgetsMock = jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([eventWidget]));
    jest.spyOn(engagementMetadataService, 'getEngagementMetadata').mockReturnValue(
        Promise.resolve([engagementMetadata]),
    );
    jest.spyOn(membershipService, 'getTeamMembers').mockReturnValue(Promise.resolve([]));
    jest.spyOn(engagementSettingService, 'getEngagementSettings').mockReturnValue(
        Promise.resolve(mockEngagementSettings),
    );

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
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([]));
        mockCreateWidget.mockReturnValue(Promise.resolve(eventWidget));
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([eventWidget]));
        const { container } = render(<EngagementForm />);

        await addEventWidget(container);

        expect(mockCreateWidget).toHaveBeenNthCalledWith(1, {
            widget_type_id: WidgetType.Events,
            engagement_id: draftEngagement.id,
            title: mockEvent.title,
        });
        expect(getWidgetsMock).toHaveBeenCalledTimes(2);
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

        getWidgetsMock.mockReturnValueOnce(Promise.resolve([]));
        mockCreateWidget.mockReturnValue(Promise.resolve(eventWidget));
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([eventWidget]));
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

        getWidgetsMock.mockReturnValueOnce(Promise.resolve([]));
        mockCreateWidget.mockReturnValue(Promise.resolve(eventWidget));
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([eventWidget]));
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
