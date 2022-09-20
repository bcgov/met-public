import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React, { ReactNode } from 'react';
import '@testing-library/jest-dom';
import EngagementListing from '../../../src/components/engagement/listing';
import { setupEnv } from './setEnvVars';
import * as reactRedux from 'react-redux';
import * as engagementService from 'services/engagementService';
import * as notificationSlice from 'services/notificationService/notificationSlice';
import { createDefaultSurvey } from 'models/survey';
import { createDefaultEngagement } from 'models/engagement';
import { EngagementStatus } from 'constants/engagementStatus';
import assert from 'assert';

const mockSurvey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: '2',
};

const mockSurveys = [mockSurvey];

const mockEngagementOne = {
    ...createDefaultEngagement(),
    id: 1,
    name: 'Engagement One',
    created_date: '2022-09-14 00:00:00',
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
        status_name: 'Published',
    },
    created_date: '2022-09-15 00:00:00',
    published_date: '2022-09-19 00:00:00',
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

describe('Engagement form page tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(notificationSlice, 'openNotification').mockImplementation(jest.fn());
    const getEngagementMock = jest.spyOn(engagementService, 'getEngagements');

    beforeEach(() => {
        setupEnv();
    });

    test('Engagement table is rendered and engagements are fetched', async () => {
        getEngagementMock.mockReturnValue(
            Promise.resolve({
                items: [mockEngagementOne, mockEngagementTwo],
                total: 2,
            }),
        );
        render(<EngagementListing />);

        await waitFor(() => {
            expect(screen.getByText('Engagement One')).toBeInTheDocument();
            expect(screen.getByText('2022-09-14')).toBeInTheDocument();
            expect(screen.getByText('Draft')).toBeInTheDocument();

            expect(screen.getByText('Engagement Two')).toBeInTheDocument();
            expect(screen.getByText('2022-09-15')).toBeInTheDocument();
            expect(screen.getByText('Published')).toBeInTheDocument();
            expect(screen.getByText('2022-09-19')).toBeInTheDocument();
            expect(screen.getByText('View Survey')).toBeInTheDocument();
            expect(screen.getByText('View Report')).toBeInTheDocument();
        });

        expect(screen.getByText('Create Engagement', { exact: false })).toBeInTheDocument();
    });

    test('Search filter works and fetchs engagements with the search text as a param', async () => {
        getEngagementMock.mockReturnValue(
            Promise.resolve({
                items: [mockEngagementOne],
                total: 1,
            }),
        );
        const { container } = render(<EngagementListing />);

        await waitFor(() => {
            expect(screen.getByText('Engagement One')).toBeInTheDocument();
        });

        const searchField = container.querySelector('input[name="searchText"]');
        assert(searchField, 'Unable to find search field that matches the given query');

        fireEvent.change(searchField, { target: { value: 'Engagement One' } });
        fireEvent.click(screen.getByTestId('engagement/listing/searchButton'));

        await waitFor(() => {
            expect(getEngagementMock).lastCalledWith({
                page: 1,
                size: 10,
                sort_key: 'name',
                sort_order: 'asc',
                search_text: 'Engagement One',
            });
        });
    });
});
