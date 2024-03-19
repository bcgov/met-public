import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SurveyEmailsSent from 'components/publicDashboard/KPI/SurveyEmailsSent';
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
    render(<SurveyEmailsSent engagement={mockEngagement} engagementIsLoading={false} />);
};

describe('SurveyEmailsSent Component Tests', () => {
    const getAggregatorMock = jest.spyOn(aggregatorService, 'getAggregatorData');

    test('displays loading indicator while fetching data', () => {
        getAggregatorMock.mockReturnValueOnce(
            Promise.resolve({
                key: '',
                value: 0,
            }),
        );
        render(<SurveyEmailsSent engagement={mockEngagement} engagementIsLoading={true} />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('displays data correctly on successful fetch', async () => {
        const mockData = { key: 'email_verification', value: 200 };
        getAggregatorMock.mockReturnValueOnce(Promise.resolve(mockData));
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText(mockData.value.toString())).toBeInTheDocument();
        });
    });

    test('displays error message on fetch failure', async () => {
        getAggregatorMock.mockRejectedValue(new Error('Fetch Error'));
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('No Data Available')).toBeInTheDocument();
        });
    });
});
