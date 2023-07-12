import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as engagementSlugService from 'services/engagementSlugService';
import * as surveyService from 'services/surveyService';
import * as reportSettingsService from 'services/surveyService/reportSettingsService';
import { createDefaultSurvey, Survey } from 'models/survey';
import { draftEngagement } from '../factory';
import ReportSettings from 'components/survey/report';
import assert from 'assert';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveyReportSettingOne = {
    id: 1,
    survey_id: survey.id,
    question_id: 1,
    question_key: 'question key one',
    question_type: 'question type one',
    question: 'question one',
    display: true,
};

const surveyReportSettingTwo = {
    id: 2,
    survey_id: survey.id,
    question_id: 2,
    question_key: 'question key two',
    question_type: 'question type two',
    question: 'question two',
    display: false,
};

const SurveyReportSettings = [surveyReportSettingOne, surveyReportSettingTwo];

const engagementSlug = {
    slug: 'engagement-name',
};

jest.mock('hooks', () => ({
    ...jest.requireActual('hooks'),
    useAppSelector: jest.fn(() => true),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useMediaQuery: jest.fn(() => true),
}));

describe('Survey report settings tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useParams').mockReturnValue({ surveyId: String(survey.id) });
    jest.spyOn(engagementService, 'getEngagement').mockReturnValue(Promise.resolve(draftEngagement));
    jest.spyOn(engagementSlugService, 'getSlugByEngagementId').mockReturnValue(Promise.resolve(engagementSlug));
    jest.spyOn(surveyService, 'getSurvey').mockReturnValue(Promise.resolve(survey));
    const fetchSurveyReportSettingsMock = jest
        .spyOn(reportSettingsService, 'fetchSurveyReportSettings')
        .mockReturnValue(Promise.resolve(SurveyReportSettings));
    const updateSurveyReportSettingsMock = jest
        .spyOn(reportSettingsService, 'updateSurveyReportSettings')
        .mockReturnValue(Promise.resolve(SurveyReportSettings));

    beforeEach(() => {
        setupEnv();
    });

    test('View survey report settings page', async () => {
        render(<ReportSettings />);

        await waitFor(() => {
            expect(fetchSurveyReportSettingsMock).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(screen.getByText(surveyReportSettingOne.question_type)).toBeVisible();
            expect(screen.getByText(surveyReportSettingOne.question)).toBeVisible();
            expect(screen.getByText(surveyReportSettingTwo.question_type)).toBeVisible();
            expect(screen.getByText(surveyReportSettingTwo.question)).toBeVisible();
        });

        expect(screen.getByTestId(`checkbox-${surveyReportSettingOne.id}`).children[0]).toBeChecked();
        expect(screen.getByTestId(`checkbox-${surveyReportSettingTwo.id}`).children[0]).not.toBeChecked();
    });

    test('Search question by question text', async () => {
        const { container } = render(<ReportSettings />);

        await waitFor(() => {
            expect(fetchSurveyReportSettingsMock).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(screen.getByText(surveyReportSettingOne.question_type)).toBeVisible();
        });

        const searchField = container.querySelector('input[name="searchText"]');
        assert(searchField, 'Unable to find search field that matches the given query');

        fireEvent.change(searchField, { target: { value: surveyReportSettingOne.question } });
        fireEvent.click(screen.getByTestId('survey/report/search-button'));

        const table = screen.getByRole('table');
        const tableBody = table.querySelector('tbody');
        assert(searchField, 'Unable to find table');

        // plus one for the row that displays a loader when the table is loading
        const originalNumberOfRows = SurveyReportSettings.length + 1;

        await waitFor(() => {
            expect(tableBody?.children.length).toBe(originalNumberOfRows - 1);
        });
    });

    test('Survey report settings can be updated', async () => {
        render(<ReportSettings />);

        await waitFor(() => {
            expect(fetchSurveyReportSettingsMock).toHaveBeenCalledTimes(1);
            expect(screen.getByText(surveyReportSettingOne.question)).toBeVisible();
            expect(screen.getByText(surveyReportSettingTwo.question)).toBeVisible();
        });

        const uncheckedBox = screen.getByTestId(`checkbox-${surveyReportSettingTwo.id}`).children[0];
        expect(uncheckedBox).toBeInTheDocument();
        expect(uncheckedBox).not.toBeChecked();

        fireEvent.click(uncheckedBox);
        await waitFor(() => {
            expect(screen.getByTestId(`checkbox-${surveyReportSettingTwo.id}`).children[0]).toBeChecked();
        });

        fireEvent.click(screen.getByTestId('survey/report/save-button'));
        await waitFor(() => {
            expect(updateSurveyReportSettingsMock).toHaveBeenNthCalledWith(1, String(survey.id), [
                {
                    ...surveyReportSettingTwo,
                    display: true,
                },
            ]);
        });
    });
});
