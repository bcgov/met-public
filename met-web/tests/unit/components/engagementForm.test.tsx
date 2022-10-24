import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../src/components/engagement/form';
import { setupEnv } from './setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as widgetService from 'services/widgetService';
import * as contactService from 'services/contactService';
import * as notificationSlice from 'services/notificationService/notificationSlice';
import * as notificationModalSlice from 'services/notificationModalService/notificationModalSlice';
import { createDefaultSurvey, Survey } from 'models/survey';
import { createDefaultEngagement, Engagement } from 'models/engagement';
import { EngagementStatus } from 'constants/engagementStatus';
import { Widget, WidgetItem, WidgetType } from 'models/widget';
import { Contact } from 'models/contact';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

const engagement: Engagement = {
    ...createDefaultEngagement(),
    id: 1,
    name: 'Test Engagement',
    created_date: '2022-09-14 20:16:29.846877',
    rich_content:
        '{"blocks":[{"key":"29p4m","text":"Test content","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    content: 'Test content',
    rich_description:
        '{"blocks":[{"key":"bqupg","text":"Test description","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    description: 'Test description',
    start_date: '2022-09-01',
    end_date: '2022-09-30',
    surveys: surveys,
    engagement_status: {
        id: EngagementStatus.Draft,
        status_name: 'Draft',
    },
};

const mockContact: Contact = {
    id: 1,
    name: 'Jace',
    title: 'prince',
    phone_number: '123-123-1234',
    email: 'jace@gmail.com',
    address: 'Dragonstone, Westeros',
    bio: 'Jacaerys Targaryen is the son and heir of Rhaenyra Targaryen',
};

const widgetItem: WidgetItem = {
    id: 1,
    widget_id: 1,
    widget_data_id: 1,
};

const widget: Widget = {
    id: 1,
    widget_type_id: WidgetType.WhoIsListening,
    engagement_id: 1,
    items: [widgetItem],
};

describe('Engagement form page tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const openNotificationMock = jest.spyOn(notificationSlice, 'openNotification').mockImplementation(jest.fn());
    const openNotificationModalMock = jest
        .spyOn(notificationModalSlice, 'openNotificationModal')
        .mockImplementation(jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(engagement));
    const patchEngagementMock = jest
        .spyOn(engagementService, 'patchEngagement')
        .mockReturnValue(Promise.resolve(engagement));
    const postEngagementMock = jest
        .spyOn(engagementService, 'postEngagement')
        .mockReturnValue(Promise.resolve(engagement));
    const getContactsMock = jest.spyOn(contactService, 'getContacts').mockReturnValue(Promise.resolve([mockContact]));
    const getWidgetsMock = jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([widget]));
    const postWidgetMock = jest.spyOn(widgetService, 'postWidget').mockReturnValue(Promise.resolve(widget));

    beforeEach(() => {
        setupEnv();
    });

    test('Create engagement form is rendered with empty input fields', async () => {
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        const { container, getByText } = render(<EngagementForm />);
        await waitFor(() => {
            expect(getByText('Engagement Name')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });
        expect(screen.getByText('Create Engagement Draft')).toBeInTheDocument();
        expect(getEngagementMock).not.toHaveBeenCalled();

        const nameInput = container.querySelector('input[name="name"]');
        expect(nameInput).not.toBeNull();
        expect(nameInput).toHaveAttribute('value', '');

        const fromDateInput = container.querySelector('input[name="start_date"]');
        expect(fromDateInput).not.toBeNull();
        expect(fromDateInput).toHaveAttribute('value', '');

        const toDateInput = container.querySelector('input[name="end_date"]');
        expect(toDateInput).not.toBeNull();
        expect(toDateInput).toHaveAttribute('value', '');

        expect(container.querySelector('input[type="file"][accept="image/*"]')).not.toBeNull();
    });

    test('Test cannot create engagement with empty fields', async () => {
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        const { container, getByText } = render(<EngagementForm />);

        const createButton = getByText('Create Engagement Draft');
        fireEvent.click(createButton);

        expect(container.querySelectorAll('.Mui-error').length).toBeGreaterThan(0);
        expect(postEngagementMock).not.toHaveBeenCalled();
    });

    test('Engagement form with saved engagement should display saved info', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(getEngagementMock).toHaveBeenCalledOnce();
        expect(screen.getByText('Update Engagement')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2022-09-01')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2022-09-30')).toBeInTheDocument();
        expect(screen.getByText('Survey 1')).toBeInTheDocument();
    });

    test('Update engagement button should trigger Put call', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });
        const updateButton = screen.getByText('Update Engagement');

        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(patchEngagementMock).toHaveBeenCalledOnce();
        });
    });

    test('Cannot add survey to unsaved engagement', async () => {
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        render(<EngagementForm />);

        const addSurveyButton = screen.getByText('Add Survey');

        fireEvent.click(addSurveyButton);

        expect(openNotificationMock).toHaveBeenNthCalledWith(1, {
            severity: 'error',
            text: 'Please save the engagement before adding a survey',
        });
    });

    test('Modal with warning appears when removing survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const removeSurveyButton = screen.getByTestId(`survey-widget/remove-${survey.id}`);

        fireEvent.click(removeSurveyButton);

        expect(openNotificationModalMock).toHaveBeenCalledOnce();
    });

    test('Cannot add more than one survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(screen.getByText('Add Survey')).toBeDisabled();
    });

    test('Can move to settings tab', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const settingsTabButton = screen.getByText('Settings');

        fireEvent.click(settingsTabButton);

        expect(screen.getByText('Engagement Link')).toBeInTheDocument();
        expect(screen.getByDisplayValue('/engagements/1/view', { exact: false })).toBeInTheDocument();
    });

    test('Remove survey triggers notification modal', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );

        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: [],
            }),
        );

        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(screen.getByText('Survey 1')).toBeInTheDocument();

        const removeSurveyButton = screen.getByTestId(`survey-widget/remove-${survey.id}`);

        fireEvent.click(removeSurveyButton);

        await waitFor(() => {
            expect(openNotificationModalMock).toHaveBeenCalledOnce();
        });
    });

    test('Widget block appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(screen.getByText('Add Widget')).toBeVisible();
        expect(screen.getByText('Who is Listening')).toBeVisible();
        expect(getContactsMock).toHaveBeenCalled();
        expect(getWidgetsMock).toHaveBeenCalled();
    });

    test('Widget drawer appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        getWidgetsMock.mockReturnValue(Promise.resolve([]));
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const addWidgetButton = screen.getByText('Add Widget');
        fireEvent.click(addWidgetButton);

        await waitFor(() => {
            expect(screen.getByText('Select Widget')).toBeVisible();
            expect(screen.getByTestId(`widget-drawer-option/${WidgetType.WhoIsListening}`));
        });
    });

    test('Who is listening widget is created when option is clicked', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([]));
        postWidgetMock.mockReturnValue(Promise.resolve(widget));
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([widget]));
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
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
        expect(postWidgetMock).toHaveBeenNthCalledWith(1, engagement.id, {
            widget_type_id: WidgetType.WhoIsListening,
            engagement_id: engagement.id,
        });
        expect(getWidgetsMock).toHaveBeenCalledTimes(2);
        expect(screen.getByText('Add This Contact')).toBeVisible();
        expect(screen.getByText('Select Existing Contact')).toBeVisible();
    });

    test('Add contact drawer appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([]));
        postWidgetMock.mockReturnValue(Promise.resolve(widget));
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([widget]));
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
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

        const createContactButton = screen.getByText('Create New Contact');
        fireEvent.click(createContactButton);

        await waitFor(() => {
            expect(screen.getByText('Add Contact')).toBeVisible();
        });
    });
});
