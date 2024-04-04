import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SurveysCompleted from 'components/publicDashboard/KPI/SurveysCompleted';
import * as aggregatorService from 'services/analytics/aggregatorService';
import { closedEngagement } from '../factory';

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useMediaQuery: jest.fn(() => true),
}));

jest.mock('hooks', () => ({
    useAppTranslation: () => ({
        t: (key: string) => {
            if (key === 'dashboard.noData') {
                return 'No Data Available';
            }
            return key; // Return key as translation fallback
        },
    }),
}));

const mockEngagement = closedEngagement;

const renderComponent = () => {
    render(<SurveysCompleted engagement={mockEngagement} engagementIsLoading={false} />);
};

describe('SurveysCompleted Component Tests', () => {
    const getAggregatorMock = jest.spyOn(aggregatorService, 'getAggregatorData');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('displays loading indicator while fetching data', () => {
        getAggregatorMock.mockReturnValueOnce(
            Promise.resolve({
                key: '',
                value: 0,
            }),
        );
        render(<SurveysCompleted engagement={mockEngagement} engagementIsLoading={true} />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('displays data correctly on successful fetch', async () => {
        const mockSurveyData = { key: 'survey_completed', value: 200 };
        const mockEmailData = { key: 'email_verification', value: 100 };

        getAggregatorMock.mockResolvedValueOnce(mockSurveyData).mockResolvedValueOnce(mockEmailData);

        renderComponent();
        await waitFor(() => {
            expect(screen.getByText(mockSurveyData.value.toString())).toBeInTheDocument();
        });
    });

    test('displays error message on fetch failure', async () => {
        getAggregatorMock.mockRejectedValueOnce(new Error('Fetch Error'));

        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('No Data Available')).toBeInTheDocument();
        });
    });
});
