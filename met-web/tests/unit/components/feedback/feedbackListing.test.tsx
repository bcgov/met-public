import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React, { ReactNode } from 'react';
import '@testing-library/jest-dom';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as feedbackService from 'services/feedbackService/index';
import * as notificationSlice from 'services/notificationService/notificationSlice';
import { createDefaultFeedback, CommentTypeEnum, SourceTypeEnum } from 'models/feedback';
import FeedbackListing from 'components/feedback/listing';

const mockFeedbackOne = {
    ...createDefaultFeedback(),
    rating: 2,
    comment: 'Feedback One',
    comment_type: CommentTypeEnum.None,
    created_date: '2022-09-17 10:00:00',
    source: SourceTypeEnum.Public,
};

const mockFeedbackTwo = {
    ...createDefaultFeedback(),
    rating: 1,
    comment: 'Feedback Two',
    comment_type: CommentTypeEnum.None,
    created_date: '2022-09-19 10:00:00',
    source: SourceTypeEnum.Public,
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

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({
        search: '',
    })),
}));

describe('Feedback Listing tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(notificationSlice, 'openNotification').mockImplementation(jest.fn());
    const getFeedbackPageMock = jest.spyOn(feedbackService, 'getFeedbacksPage');

    beforeEach(() => {
        setupEnv();
    });

    test('Feedback table is rendered and feedback is fetched', async () => {
        getFeedbackPageMock.mockReturnValue(
            Promise.resolve({
                items: [mockFeedbackOne, mockFeedbackTwo],
                total: 2,
            }),
        );
        render(<FeedbackListing />);

        await waitFor(() => {
            expect(screen.getByText('Feedback One')).toBeInTheDocument();
            expect(screen.getByText('2022-09-17')).toBeInTheDocument();

            expect(screen.getByText('Feedback Two')).toBeInTheDocument();
            expect(screen.getByText('2022-09-19')).toBeInTheDocument();
        });
    });

    test('Feedback table is empty', async () => {
        render(<FeedbackListing />);
        const feedbackListing = screen.getByTestId('listing-table');

        getFeedbackPageMock.mockReturnValue(
            Promise.resolve({
                items: [],
                total: 0,
            }),
        );
        render(<FeedbackListing />);

        await waitFor(() => {
            expect(feedbackListing).toBeVisible();
        });
    });

    test('fetchs feedback with the sort key as the rating', async () => {
        getFeedbackPageMock.mockReturnValue(
            Promise.resolve({
                items: [mockFeedbackOne],
                total: 1,
            }),
        );
        render(<FeedbackListing />);

        await waitFor(() => {
            expect(screen.getByText('Feedback One')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(getFeedbackPageMock).lastCalledWith({
                page: 1,
                size: 10,
                sort_key: 'rating',
                sort_order: 'asc',
            });
        });
    });

    test('Test feedback table pagination', async () => {
        const feedbackList = new Array(11);

        getFeedbackPageMock.mockReturnValue(
            Promise.resolve({
                items: feedbackList.fill(mockFeedbackOne),
                total: 11,
            }),
        );
        render(<FeedbackListing />);

        const GoToNextPageButton = screen.getByLabelText('Go to next page');
        const GoToPreviousPageButton = screen.getByLabelText('Go to previous page');

        fireEvent.click(GoToNextPageButton);
        fireEvent.click(GoToPreviousPageButton);

        await waitFor(() => {
            expect(getFeedbackPageMock).lastCalledWith({
                page: 1,
                size: 10,
                sort_key: 'rating',
                sort_order: 'asc',
            });
        });
    });
});
