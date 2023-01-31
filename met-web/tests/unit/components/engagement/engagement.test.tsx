import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementView from 'components/engagement/view';
import { Contact } from 'models/contact';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import { Widget, WidgetItem, WidgetType } from 'models/widget';
import { createDefaultSurvey, Survey } from 'models/survey';
import { draftEngagement } from '../factory';

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

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
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

const mockContactRtkUnwrap = jest.fn(() => Promise.resolve(mockContact));
const mockContactRtkTrigger = () => {
    return {
        unwrap: mockContactRtkUnwrap,
    };
};
export const mockContactRtkQuery = () => [mockContactRtkTrigger];

const mockLazyGetContactQuery = jest.fn(mockContactRtkQuery);
jest.mock('apiManager/apiSlices/contacts', () => ({
    ...jest.requireActual('apiManager/apiSlices/contacts'),
    useLazyGetContactQuery: () => [...mockLazyGetContactQuery()],
}));

describe('Engagement View page tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useLocation').mockReturnValue(mockLocationData);
    jest.spyOn(reactRouter, 'useParams').mockReturnValue({ engagementId: '1' });
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));

    beforeEach(() => {
        setupEnv();
    });

    test('Look at Engagement view', async () => {
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
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
                ...draftEngagement,
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
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([whoIsListeningWidget]));
        mockContactRtkUnwrap.mockReturnValueOnce(Promise.resolve(mockContact));
        const { container } = render(<EngagementView />);

        await waitFor(() => {
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
            expect(screen.getByText('Who is Listening')).toBeVisible();
        });

        expect(screen.getByText(mockContact.name)).toBeVisible();
        expect(screen.getByText(mockContact.email)).toBeVisible();

        expect(getEngagementMock).toHaveBeenCalledOnce();
        expect(mockWidgetsRtkUnwrap).toHaveBeenCalledOnce();
        expect(mockContactRtkUnwrap).toHaveBeenCalledOnce();
    });

    test('Phases widget appears', async () => {
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([engagementPhasesWidget]));
        const { container } = render(<EngagementView />);

        await waitFor(() => {
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
            expect(mockWidgetsRtkUnwrap).toHaveReturned();
        });

        expect(mockWidgetsRtkUnwrap).toHaveBeenCalledOnce();
        expect(getEngagementMock).toHaveBeenCalledOnce();

        const eaProcessAccordion = screen.getByTestId('eaProcessAccordion');
        expect(eaProcessAccordion).toBeVisible();
    });
});
