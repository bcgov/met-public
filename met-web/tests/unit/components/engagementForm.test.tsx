import { render, waitFor, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
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
import * as surveyService from 'services/surveyService/form';
import { EngagementStatus } from 'constants/engagementStatus';

const mockSurvey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: '1',
};

const mockSurveys = [mockSurvey];

const mockEngagement = {
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
    surveys: mockSurveys,
    engagement_status: {
        id: EngagementStatus.Draft,
        status_name: 'Draft',
    },
};

describe('Engagement form page tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const openNotificationMock = jest.spyOn(notificationSlice, 'openNotification').mockImplementation(jest.fn());
    const unlinkSurveyMock = jest.spyOn(surveyService, 'unlinkSurvey').mockReturnValueOnce(Promise.resolve(mockSurvey));
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(mockEngagement));
    const putEngagementMock = jest
        .spyOn(engagementService, 'putEngagement')
        .mockReturnValue(Promise.resolve(mockEngagement));
    const postEngagementMock = jest
        .spyOn(engagementService, 'postEngagement')
        .mockReturnValue(Promise.resolve(mockEngagement));

    beforeEach(() => {
        setupEnv();
    });

    test('Create engagement form is rendered with empty input fields', async () => {
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        const { container, getByText } = render(<EngagementForm />);
        await waitFor(() => {
            expect(getByText('Engagement Name')).toBeInTheDocument();
        });
        expect(screen.getByText('Create Engagement Draft')).toBeInTheDocument();
        expect(getEngagementMock).not.toHaveBeenCalled();

        const nameInput = container.querySelector('input[name="name"]');
        expect(nameInput).not.toBeNull();
        expect(nameInput).toHaveAttribute('value', '');

        const fromDateInput = container.querySelector('input[name="fromDate"]');
        expect(fromDateInput).not.toBeNull();
        expect(fromDateInput).toHaveAttribute('value', '');

        const toDateInput = container.querySelector('input[name="toDate"]');
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

    test('Cannot add more than one survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...mockEngagement,
                surveys: mockSurveys,
            }),
        );
        render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        expect(screen.getByText('Add Survey')).toBeDisabled();
    });

    test('Can move to settings tab', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...mockEngagement,
                surveys: mockSurveys,
            }),
        );
        render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        const settingsTabButton = screen.getByText('Settings');

        fireEvent.click(settingsTabButton);

        expect(screen.getByText('Engagement Link')).toBeInTheDocument();
        expect(screen.getByDisplayValue('/engagement/view/1', { exact: false })).toBeInTheDocument();
    });

    test('Can remove survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...mockEngagement,
                surveys: mockSurveys,
            }),
        );

        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...mockEngagement,
                surveys: [],
            }),
        );

        render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        expect(screen.getByText('Survey 1')).toBeInTheDocument();

        const removeSurveyButton = screen.getByTestId('survey-widget/remove');

        fireEvent.click(removeSurveyButton);

        await waitFor(() => {
            expect(screen.getByText('Confirm')).toBeInTheDocument();
        });

        const modalConfirmButton = screen.getByText('Confirm');

        fireEvent.click(modalConfirmButton);

        await waitForElementToBeRemoved(() => screen.queryByText('Survey 1'));
        expect(unlinkSurveyMock).toHaveBeenCalledOnce();
        expect(getEngagementMock).toHaveBeenCalledTimes(2);
    });

    test('Cannot remove survey from engagement with status not draft', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...mockEngagement,
                surveys: mockSurveys,
                engagement_status: {
                    id: EngagementStatus.Published,
                    status_name: 'Published',
                },
            }),
        );

        render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        expect(screen.getByText('Survey 1')).toBeInTheDocument();

        const removeSurveyButton = screen.getByTestId('survey-widget/remove');

        fireEvent.click(removeSurveyButton);

        await waitFor(() => {
            expect(screen.getByText('Confirm')).toBeInTheDocument();
        });

        const modalConfirmButton = screen.getByText('Confirm');

        fireEvent.click(modalConfirmButton);

        await waitFor(() => {
            expect(openNotificationMock).toHaveBeenNthCalledWith(1, {
                severity: 'error',
                text: 'Cannot remove survey from an engagement of status Published',
            });
        });
        expect(unlinkSurveyMock).not.toHaveBeenCalled();
        expect(getEngagementMock).toHaveBeenCalledOnce();
    });
});
