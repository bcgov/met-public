import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementView from 'components/engagement/view';
import { Contact } from 'models/contact';
import { setupEnv } from './setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as widgetService from 'services/widgetService';
import * as contactService from 'services/contactService';
import { Widget, WidgetItem, WidgetType } from 'models/widget';
import { createDefaultSurvey, Survey } from 'models/survey';
import { engagement } from '../components/factory';

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

const widgetItem: WidgetItem = {
    id: 1,
    widget_id: 1,
    widget_data_id: 1,
    sort_index: 1,
};

const whoIsListeningWidget: Widget = {
    id: 1,
    widget_type_id: WidgetType.WhoIsListening,
    engagement_id: 1,
    items: [widgetItem],
};

const engagementPhasesWidget: Widget = {
    id: 2,
    widget_type_id: WidgetType.Phases,
    engagement_id: 1,
    items: [],
};

const mockLocationData = { state: { open: true }, pathname: '', search: '', hash: '', key: '' };

jest.mock('hooks', () => ({
    ...jest.requireActual('hooks'),
    useAppSelector: jest.fn(() => true),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useMediaQuery: jest.fn(() => true),
}));

describe('Engagement View page tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useLocation').mockReturnValue(mockLocationData);
    jest.spyOn(reactRouter, 'useParams').mockReturnValue({ engagementId: '1' });
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(engagement));
    const getContactMock = jest.spyOn(contactService, 'getContact').mockReturnValue(Promise.resolve(mockContact));
    const getWidgetsMock = jest.spyOn(widgetService, 'getWidgets');

    beforeEach(() => {
        setupEnv();
    });

    test('Look at Engagement view', async () => {
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        render(<EngagementView />);
        await waitFor(() => {
            expect(screen.getByTestId(`engagement-content`)).toBeVisible();
        });

        expect(getEngagementMock).toHaveBeenCalledOnce();
    });

    test('Widget block appears', async () => {
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        render(<EngagementView />);

        await waitFor(() => {
            expect(screen.getByTestId(`widget-block`)).toBeVisible();
        });

        expect(getEngagementMock).toHaveBeenCalledOnce();
    });

    test('Who is listening widget appears', async () => {
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([whoIsListeningWidget]));
        getContactMock.mockReturnValueOnce(Promise.resolve(mockContact));
        const { container } = render(<EngagementView />);

        await waitFor(() => {
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
            expect(screen.getByText('Who is Listening')).toBeVisible();
        });

        expect(screen.getByText(mockContact.name)).toBeVisible();
        expect(screen.getByText(mockContact.email)).toBeVisible();

        expect(getEngagementMock).toHaveBeenCalledOnce();
        expect(getWidgetsMock).toHaveBeenCalledOnce();
        expect(getContactMock).toHaveBeenCalledOnce();
    });

    test('Phases widget appears', async () => {
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([engagementPhasesWidget]));
        const { container } = render(<EngagementView />);

        await waitFor(() => {
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
            expect(getWidgetsMock).toHaveReturned();
        });

        expect(getWidgetsMock).toHaveBeenCalledOnce();
        expect(getEngagementMock).toHaveBeenCalledOnce();

        expect(screen.getByText('The EA Process')).toBeVisible();
        expect(screen.getByText('Early Engagement')).toBeVisible();
        expect(screen.getByText('Readiness Decision')).toBeVisible();
        expect(screen.getByText('Process Planning')).toBeVisible();
        expect(screen.getByText('Application Development & Review')).toBeVisible();
        expect(screen.getByText('Effect Assessment & Review')).toBeVisible();
        expect(screen.getByText('Decision')).toBeVisible();
        expect(screen.getByText('Post-Certificate')).toBeVisible();
    });
});
