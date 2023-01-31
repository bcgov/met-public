import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React, { ReactNode } from 'react';
import '@testing-library/jest-dom';
import Dashboard from 'components/dashboard';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as engagementService from 'services/engagementService';
import * as notificationSlice from 'services/notificationService/notificationSlice';
import { createDefaultSurvey } from 'models/survey';
import { createDefaultEngagement } from 'models/engagement';
import { EngagementStatus } from 'constants/engagementStatus';

const mockSurvey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 2,
};

const mockSurveys = [mockSurvey];

const mockEngagementOne = {
    ...createDefaultEngagement(),
    id: 1,
    name: 'Engagement One',
    created_date: '2022-09-14 10:00:00',
    rich_content:
        '{"blocks":[{"key":"29p4m","text":"Test content","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    content: 'Test content',
    rich_description:
        '{"blocks":[{"key":"bqupg","text":"Test description","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    description: 'Test description',
    start_date: '2022-09-01',
    end_date: '2022-09-30',
    engagement_status: {
        id: EngagementStatus.Draft,
        status_name: 'Draft',
    },
};

const mockEngagementTwo = {
    ...mockEngagementOne,
    id: 2,
    name: 'Engagement Two',
    engagement_status: {
        id: EngagementStatus.Published,
        status_name: 'Open',
    },
    start_date: '2022-09-01',
    end_date: '2025-09-30',
    created_date: '2022-09-15 10:00:00',
    published_date: '2022-09-19 10:00:00',
    surveys: mockSurveys,
    submissions_meta_data: {
        total: 1,
    },
};

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

describe('Dashboard page tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(notificationSlice, 'openNotification').mockImplementation(jest.fn());
    const getEngagementMock = jest.spyOn(engagementService, 'getEngagements');

    beforeEach(() => {
        setupEnv();
    });

    test('Dashboard is rendered and engagements are fetched', async () => {
        getEngagementMock.mockReturnValue(
            Promise.resolve({
                items: [mockEngagementOne, mockEngagementTwo],
                total: 2,
            }),
        );
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Engagement One')).toBeInTheDocument();
            expect(screen.getByText('Engagement Two')).toBeInTheDocument();
        });
    });

    test('Accordion expands and dashboard is displayed', async () => {
        getEngagementMock.mockReturnValue(
            Promise.resolve({
                items: [mockEngagementOne, mockEngagementTwo],
                total: 1,
            }),
        );
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Engagement Two')).toBeInTheDocument();
        });

        const accordion = screen.getByTestId(`engagement-accordion-${mockEngagementTwo.id}`);
        expect(accordion).toBeVisible();

        fireEvent.click(accordion);
        expect(screen.getByTestId(`dashboard-frame-${mockEngagementTwo.id}`)).toBeVisible();
    });
});
