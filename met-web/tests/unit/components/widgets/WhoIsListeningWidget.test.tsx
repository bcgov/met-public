import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as widgetService from 'services/widgetService';
import * as contactService from 'services/contactService';
import { createDefaultSurvey, Survey } from 'models/survey';
import { Widget, WidgetItem, WidgetType } from 'models/widget';
import { Contact } from 'models/contact';
import { Box } from '@mui/material';
import { engagement } from '../factory';

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
    widget_type_id: WidgetType.WhoIsListening,
    engagement_id: 1,
    items: [contactWidgetItem],
};

jest.mock('react-dnd', () => ({
    ...jest.requireActual('react-dnd'),
    useDrag: jest.fn(),
    useDrop: jest.fn(),
}));

jest.mock('components/common/Dragndrop', () => ({
    ...jest.requireActual('components/common/Dragndrop'),
    DragItem: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

describe('Who is Listening widget  tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(engagement));
    const getContactsMock = jest.spyOn(contactService, 'getContacts')
        .mockReturnValue(Promise.resolve([mockContact]));
    const getWidgetsMock = jest
        .spyOn(widgetService, 'getWidgets')
        .mockReturnValue(Promise.resolve([whoIsListeningWidget]));
    const postWidgetMock = jest
        .spyOn(widgetService, 'postWidget')
        .mockReturnValue(Promise.resolve(whoIsListeningWidget));

    beforeEach(() => {
        setupEnv();
    });
   
    async function addWhosIsListeningWidget(container: HTMLElement) {
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
    }

    test('Who is listening widget is created when option is clicked', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([]));
        postWidgetMock.mockReturnValue(Promise.resolve(whoIsListeningWidget));
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([whoIsListeningWidget]));
        const { container } = render(<EngagementForm />);

        await addWhosIsListeningWidget(container);

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
        postWidgetMock.mockReturnValue(Promise.resolve(whoIsListeningWidget));
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([whoIsListeningWidget]));
        const { container } = render(<EngagementForm />);

        await addWhosIsListeningWidget(container);

        await waitFor(() => {
            expect(screen.getByText('Create New Contact')).toBeVisible();
            expect(screen.getByText(mockContact.email)).toBeVisible();
        });

        expect(getContactsMock).toHaveBeenCalled();

        const createContactButton = screen.getByText('Create New Contact');
        fireEvent.click(createContactButton);

        await waitFor(() => {
            expect(screen.getByText('Add Contact')).toBeVisible();
        });
    });
});
