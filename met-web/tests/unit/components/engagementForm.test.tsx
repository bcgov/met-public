import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../src/components/engagement/form';
import { setupEnv } from './setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as notificationSlice from 'services/notificationService/notificationSlice';
import { createDefaultSurvey } from 'models/survey';
import { createDefaultEngagement } from 'models/engagement';

const surveys = [
    {
        ...createDefaultSurvey(),
        engagement_id: '1',
        id: 1,
        name: 'Survey 1',
    },
];

const savedEngagement = {
    ...createDefaultEngagement(),
    content: 'Test content',
    created_date: '2022-09-14 20:16:29.846877',
    description: 'Test description',
    end_date: '2022-09-30',
    id: 1,
    name: 'Test Engagement',
    rich_content:
        '{"blocks":[{"key":"29p4m","text":"Test content","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    rich_description:
        '{"blocks":[{"key":"bqupg","text":"Test description","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    start_date: '2022-09-01',
    surveys: surveys,
};

describe('EngagementForm', () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector').mockReturnValue({});
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    const useNavigateMock = jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(savedEngagement));
    const putEngagementMock = jest
        .spyOn(engagementService, 'putEngagement')
        .mockReturnValue(Promise.resolve(savedEngagement));

    beforeEach(() => {
        setupEnv();
    });
    afterEach(() => {
        useSelectorMock.mockClear();
        useDispatchMock.mockClear();
        useNavigateMock.mockClear();
        useParamsMock.mockClear();
        getEngagementMock.mockClear();
        putEngagementMock.mockClear();
    });

    test('Test Engagement Form renders and has empty inputs by default', async () => {
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        const { getByText } = render(<EngagementForm />);
        await waitFor(() => {
            expect(getByText('Engagement Name')).toBeInTheDocument();
        });
        expect(screen.getByText('Create Engagement Draft')).toBeInTheDocument();
    });

    test('Test cannot create engagement with empty fields', async () => {
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        const { container, getByText } = render(<EngagementForm />);

        const createButton = getByText('Create Engagement Draft');
        fireEvent.click(createButton);

        expect(container.querySelectorAll('.Mui-error').length).toBeGreaterThan(0);
    });

    test('Engagement form with saved engagement should display saved info', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        expect(getEngagementMock).toHaveBeenCalledOnce();
        expect(screen.getByText('Update Engagement')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2022-09-01')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2022-09-30')).toBeInTheDocument();
        expect(screen.getByText('Survey 1')).toBeInTheDocument();
    });

    test('Update engagement button should trigger Put call', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });
        const updateButton = screen.getByText('Update Engagement');

        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(putEngagementMock).toHaveBeenCalledOnce();
        });
    });

    test('Cannot add survey to unsaved engagement', async () => {
        const openNotificationMock = jest.spyOn(notificationSlice, 'openNotification').mockImplementation(jest.fn());
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        render(<EngagementForm />);

        const addSurveyButton = screen.getByText('Add Survey');

        fireEvent.click(addSurveyButton);

        expect(openNotificationMock).toHaveBeenNthCalledWith(1, {
            severity: 'error',
            text: 'Please save the engagement before adding a survey',
        });
        openNotificationMock.mockClear();
    });

    test('Modal with warning appears when removing survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        const removeSurveyButton = screen.getByTestId('survey-widget/remove');

        fireEvent.click(removeSurveyButton);

        expect(screen.getByText('Do you want to remove this survey?')).toBeInTheDocument();
    });
});
