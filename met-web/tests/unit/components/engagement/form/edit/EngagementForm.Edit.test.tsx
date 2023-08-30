import { render, waitFor, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../../../src/components/engagement/form';
import { setupEnv } from '../../../setEnvVars';
import { createDefaultSurvey, Survey } from 'models/survey';
import { draftEngagement, engagementSlugData } from '../../../factory';
import { setupCommonMocks } from './jestTestUtils';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

let useParamsMock: jest.SpyInstance;
let getEngagementMock: jest.SpyInstance;
let openNotificationModalMock: jest.SpyInstance;
let getEngagementSlugMock: jest.SpyInstance;

describe('Engagement form page tests', () => {
    beforeAll(() => {
        const mocks = setupCommonMocks();
        useParamsMock = mocks.useParamsMock;
        getEngagementMock = mocks.getEngagementMock;
        getEngagementSlugMock = mocks.getSlugByEngagementIdMock;
    });

    beforeEach(() => {
        setupEnv();
    });

    test('Can move to settings tab', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
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

        expect(screen.getByText('Engagement Information')).toBeInTheDocument();
        expect(screen.getByText('Internal Engagement')).toBeInTheDocument();
        expect(screen.getByText('Send Report')).toBeInTheDocument();
    });

    test('Can move to links tab', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const settingsTabButton = screen.getByText('URL (links)');

        fireEvent.click(settingsTabButton);

        expect(screen.getByText('Public URLs (links)')).toBeInTheDocument();
        expect(screen.getByText('Link to Public Engagement Page')).toBeInTheDocument();
        expect(screen.getByText('Link to Public Dashboard Report')).toBeInTheDocument();
        await waitFor(() => {
            expect(getEngagementSlugMock).toHaveReturned();
            expect(screen.getAllByDisplayValue(engagementSlugData.slug, { exact: false })).toBeArrayOfSize(2);
        });
    });

    test('Remove survey triggers notification modal', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );

        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
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

    test('Day Calculator Modal appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { getByTestId, container, getByText } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const dayCalculatorButton = screen.getByText('Day Calculator');

        fireEvent.click(dayCalculatorButton);

        await waitFor(() => {
            expect(getByTestId('daycalculator-title')).toBeVisible();
            expect(getByTestId('reset-button')).toBeVisible();
            expect(getByTestId('cancel-button')).toBeVisible();
            expect(getByTestId('calculator-button')).toBeVisible();
            expect(getByText('Calculation Type')).toBeInTheDocument();
            expect(getByText('Number of Days')).toBeInTheDocument();
            const autocomplete = getByTestId('autocomplete');
            const input: HTMLInputElement = within(autocomplete).getByLabelText('Day Zero') as HTMLInputElement;
            expect(input).not.toBeNull();
            const suspensiondate = screen.queryByText('Suspension Date');
            expect(suspensiondate).toBeNull();
            const ruspensiondate = screen.queryByText('Resumption Date');
            expect(ruspensiondate).toBeNull();
        });
    });

    test('Day Calculator Modal Day Zero Calculation', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const dayCalculatorButton = screen.getByText('Day Calculator');

        fireEvent.click(dayCalculatorButton);

        await waitFor(() => {
            const startDate = screen.getByPlaceholderText('startDate');
            const endDate = screen.getByPlaceholderText('endDate');
            fireEvent.change(startDate, { target: { value: '2022-12-19' } });
            fireEvent.change(endDate, { target: { value: '2022-12-25' } });
            const calculatorButton = screen.getByText('Calculate');
            fireEvent.click(calculatorButton);
            const numberOfDays = screen.getByPlaceholderText('numberOfDays') as HTMLInputElement;
            expect(numberOfDays.value).toBe('6');
        });
    });

    test('Day Calculator Modal Start Date Calculation', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const dayCalculatorButton = screen.getByText('Day Calculator');

        fireEvent.click(dayCalculatorButton);

        await waitFor(() => {
            const numberOfDays = screen.getByPlaceholderText('numberOfDays');
            const endDate = screen.getByPlaceholderText('endDate');
            fireEvent.change(numberOfDays, { target: { value: '6' } });
            fireEvent.change(endDate, { target: { value: '2022-12-25' } });
            const calculatorButton = screen.getByText('Calculate');
            fireEvent.click(calculatorButton);
            const startDate = screen.getByPlaceholderText('startDate') as HTMLInputElement;
            expect(startDate.value).toBe('2022-12-19');
        });
    });

    test('Day Calculator Modal End Date Calculation', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const dayCalculatorButton = screen.getByText('Day Calculator');

        fireEvent.click(dayCalculatorButton);

        await waitFor(() => {
            const startDate = screen.getByPlaceholderText('startDate');
            const numberOfDays = screen.getByPlaceholderText('numberOfDays');
            fireEvent.change(startDate, { target: { value: '2022-12-19' } });
            fireEvent.change(numberOfDays, { target: { value: '6' } });
            const calculatorButton = screen.getByText('Calculate');
            fireEvent.click(calculatorButton);
            const endDate = screen.getByPlaceholderText('endDate') as HTMLInputElement;
            expect(endDate.value).toBe('2022-12-25');
        });
    });
});
