import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import * as reactRedux from 'react-redux';
import * as notificationSlice from 'services/notificationService/notificationSlice';
import * as feedbackService from 'services/feedbackService';
import '@testing-library/jest-dom';
import { setupEnv } from './setEnvVars';
import { FeedbackModal } from 'components/common/Modals/Feedback';
import { CommentTypeEnum } from 'models/feedback';

describe('Feedback modal tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(notificationSlice, 'openNotification').mockImplementation(jest.fn());
    const createFeedbackMock = jest.spyOn(feedbackService, 'createFeedback');

    beforeEach(() => {
        setupEnv();
    });

    test('Create feedback is rendered with empty input fields', async () => {
        const { getByTestId } = render(<FeedbackModal />);
        const feedbackButton = getByTestId('feedback-button');
        await waitFor(() => {
            expect(feedbackButton).toBeVisible();
        });
        fireEvent.click(feedbackButton);
        await waitFor(() => {
            expect(getByTestId('feedback-title')).toBeVisible();
        });

        const submitButton = getByTestId('submit-button');
        expect(submitButton).toBeDisabled();
    });

    test('Select comment type shows comment input', async () => {
        const { getByTestId } = render(<FeedbackModal />);
        const feedbackButton = getByTestId('feedback-button');
        await waitFor(() => {
            expect(feedbackButton).toBeVisible();
        });
        fireEvent.click(feedbackButton);
        await waitFor(() => {
            expect(getByTestId('feedback-title')).toBeVisible();
        });

        const issueButton = getByTestId('comment-type-issue-button');
        expect(issueButton).toBeVisible();
        fireEvent.click(issueButton);

        const commentInput = getByTestId('comment-input');
        expect(commentInput).toBeVisible();
    });

    test('Submit shows thank you message', async () => {
        createFeedbackMock.mockReturnValue(
            Promise.resolve({ comment_type: CommentTypeEnum.None, comment: '', rating: 1, created_date: '' }),
        );
        const { getByTestId } = render(<FeedbackModal />);
        const feedbackButton = getByTestId('feedback-button');
        await waitFor(() => {
            expect(feedbackButton).toBeVisible();
        });
        fireEvent.click(feedbackButton);
        await waitFor(() => {
            expect(getByTestId('feedback-title')).toBeVisible();
        });
        const ratingInput = getByTestId('rating-input');
        fireEvent.click(ratingInput.getElementsByTagName('label')[0]);
        const submitButton = getByTestId('submit-button');
        expect(submitButton).not.toBeDisabled();
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(getByTestId('success-title')).toBeVisible();
        });
    });
});
