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
import { createDefaultSurvey, Survey } from 'models/survey';
import { Widget, WidgetItem, WidgetType } from 'models/widget';
import { Contact } from 'models/contact';
import { Box } from '@mui/material';
import { draftEngagement, engagementMetadata } from '../factory';
import { USER_ROLES } from 'services/userService/constants';
import { EngagementSettings, createDefaultEngagementSettings } from 'models/engagement';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

const mockContact: Contact = {
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
    title: 'Who is Listening',
    widget_type_id: WidgetType.WhoIsListening,
    engagement_id: 1,
    items: [contactWidgetItem],
};

const mockEngagementSettings: EngagementSettings = {
    ...createDefaultEngagementSettings(),
};

jest.mock('axios');

jest.mock('components/map', () => () => {
    return <div></div>;
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ search: '' })),
    useParams: jest.fn(() => {
        return { projectId: '' };
    }),
    useNavigate: () => jest.fn(),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => {
        return {
            roles: [USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS, USER_ROLES.EDIT_ENGAGEMENT, USER_ROLES.CREATE_ENGAGEMENT],
            assignedEngagements: [draftEngagement.id],
        };
    }),
}));

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));

const mockContactsRtkUnwrap = jest.fn(() => Promise.resolve([mockContact]));
const mockContactsRtkTrigger = () => {
    return {
        unwrap: mockContactsRtkUnwrap,
    };
};
export const mockContactsRtkQuery = () => [mockContactsRtkTrigger];

const mockContactRtkUnwrap = jest.fn(() => Promise.resolve(mockContact));
const mockContactRtkTrigger = () => {
    return {
        unwrap: mockContactRtkUnwrap,
    };
};
export const mockContactRtkQuery = () => [mockContactRtkTrigger];

const mockLazyGetContactsQuery = jest.fn(mockContactsRtkQuery);
const mockLazyGetContactQuery = jest.fn(mockContactRtkQuery);
jest.mock('apiManager/apiSlices/contacts', () => ({
    ...jest.requireActual('apiManager/apiSlices/contacts'),
    useLazyGetContactsQuery: () => [...mockLazyGetContactsQuery()],
    useLazyGetContactQuery: () => [...mockLazyGetContactQuery()],
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

const mockCreateWidget = jest.fn(() => Promise.resolve(whoIsListeningWidget));
const mockCreateWidgetItems = jest.fn(() => Promise.resolve(contactWidgetItem));
const mockCreateWidgetItemsTrigger = jest.fn(() => {
    return {
        unwrap: mockCreateWidgetItems,
    };
});
jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useCreateWidgetMutation: () => [mockCreateWidget],
    useCreateWidgetItemsMutation: () => [mockCreateWidgetItemsTrigger],
    useUpdateWidgetMutation: () => [jest.fn(() => Promise.resolve(whoIsListeningWidget))],
    useDeleteWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useSortWidgetsMutation: () => [jest.fn(() => Promise.resolve())],
}));
jest.spyOn(engagementMetadataService, 'getEngagementMetadata').mockReturnValue(Promise.resolve([engagementMetadata]));

describe('Who is Listening widget  tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(engagementMetadataService, 'getEngagementMetadata').mockReturnValue(
        Promise.resolve([engagementMetadata]),
    );
    jest.spyOn(membershipService, 'getTeamMembers').mockReturnValue(Promise.resolve([]));
    jest.spyOn(engagementSettingService, 'getEngagementSettings').mockReturnValue(
        Promise.resolve(mockEngagementSettings),
    );
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    const getWidgetsMock = jest
        .spyOn(widgetService, 'getWidgets')
        .mockReturnValue(Promise.resolve([whoIsListeningWidget]));

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
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([]));
        mockCreateWidget.mockReturnValue(Promise.resolve(whoIsListeningWidget));
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([whoIsListeningWidget]));
        const { container } = render(<EngagementForm />);

        await addWhosIsListeningWidget(container);

        expect(mockCreateWidget).toHaveBeenNthCalledWith(1, {
            widget_type_id: WidgetType.WhoIsListening,
            engagement_id: draftEngagement.id,
            title: whoIsListeningWidget.title,
        });
        expect(getWidgetsMock).toHaveBeenCalledTimes(2);
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

        getWidgetsMock.mockReturnValueOnce(Promise.resolve([]));
        mockCreateWidget.mockReturnValue(Promise.resolve(whoIsListeningWidget));
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([whoIsListeningWidget]));
        const { container } = render(<EngagementForm />);

        await addWhosIsListeningWidget(container);

        await waitFor(() => {
            expect(screen.getByText('Create New Contact')).toBeVisible();
            expect(screen.getByText(mockContact.email)).toBeVisible();
        });

        const createContactButton = screen.getByText('Create New Contact');
        fireEvent.click(createContactButton);

        await waitFor(() => {
            expect(screen.getByText('Add Contact')).toBeVisible();
        });
    });
});
