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
import { draftEngagement, openEngagement } from '../factory';

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Link: ({ children }: { children: ReactNode }) => {
        return <a>{children}</a>;
    },
}));

jest.mock('components/common', () => ({
    ...jest.requireActual('components/common'),
    PrimaryButton: ({ children, ...rest }: { children: ReactNode; [prop: string]: unknown }) => {
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
        getEngagementMock.mockReturnValue(
            Promise.resolve({
                items: [draftEngagement, openEngagement],
                total: 2,
            }),
        );
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Test Engagement')).toBeInTheDocument();
            expect(screen.getByText('Open Engagement')).toBeInTheDocument();
        });
    });

    test('Accordion expands and dashboard is displayed', async () => {
        getEngagementMock.mockReturnValue(
            Promise.resolve({
                items: [draftEngagement, openEngagement],
                total: 1,
            }),
        );
        getAggregatorMock.mockReturnValue(
            Promise.resolve({
                key: '',
                value: 0,
            }),
        );
        getUserResponseDetailByMonthMock.mockReturnValue(
            Promise.resolve({
                showdataby: '',
                responses: 0,
            }),
        );
        getSurveyResultDataMock.mockReturnValue(
            Promise.resolve({
                data: [
                    {
                        label: '',
                        postion: 0,
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
