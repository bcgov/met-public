import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React, { ReactNode } from 'react';
import '@testing-library/jest-dom';
import Dashboard from 'components/dashboard';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as engagementService from 'services/engagementService';
import * as aggregatorService from 'services/analytics/aggregatorService';
import * as userResponseDetailService from 'services/analytics/userResponseDetailService';
import * as surveyResultService from 'services/analytics/surveyResult';
import * as notificationSlice from 'services/notificationService/notificationSlice';
import { openEngagement, closedEngagement } from '../factory';

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Link: ({ children }: { children: ReactNode }) => {
        return <a>{children}</a>;
    },
}));

jest.mock('axios')

jest.mock('components/common', () => ({
    ...jest.requireActual('components/common'),
    PrimaryButton: ({ children, ...rest }: { children: ReactNode;[prop: string]: unknown }) => {
        return <button {...rest}>{children}</button>;
    },
}));

jest.mock('maplibre-gl/dist/maplibre-gl', () => ({
    Map: () => ({}),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useMediaQuery: jest.fn(() => true),
}));

describe('Dashboard page tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(notificationSlice, 'openNotification').mockImplementation(jest.fn());
    const getEngagementMock = jest.spyOn(engagementService, 'getEngagements');
    const getAggregatorMock = jest.spyOn(aggregatorService, 'getAggregatorData');
    const getUserResponseDetailByMonthMock = jest.spyOn(userResponseDetailService, 'getUserResponseDetailByMonth');
    const getSurveyResultDataMock = jest.spyOn(surveyResultService, 'getSurveyResultData');

    beforeEach(() => {
        setupEnv();
    });

    test('Dashboard is rendered and engagements are fetched', async () => {
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                items: [openEngagement, closedEngagement],
                total: 2,
            }),
        );
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Open Engagement')).toBeInTheDocument();
            expect(screen.getByText('Closed Engagement')).toBeInTheDocument();
        });
    });

    test('Accordion expands and dashboard is displayed', async () => {
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                items: [closedEngagement, openEngagement],
                total: 1,
            }),
        );
        getAggregatorMock.mockReturnValueOnce(
            Promise.resolve({
                key: '',
                value: 0,
            }),
        );
        getUserResponseDetailByMonthMock.mockReturnValueOnce(
            Promise.resolve({
                showdataby: '',
                responses: 0,
            }),
        );
        getSurveyResultDataMock.mockReturnValueOnce(
            Promise.resolve({
                data: [
                    {
                        label: '',
                        position: 0,
                        result: [{ value: '', count: 0 }],
                    },
                ],
            }),
        );
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Open Engagement')).toBeInTheDocument();
        });

        const accordion = screen.getByTestId(`engagement-accordion-${openEngagement.id}`);
        expect(accordion).toBeVisible();

        fireEvent.click(accordion);
        expect(screen.getByTestId(`dashboard-frame-${openEngagement.id}`)).toBeVisible();
    });
});
