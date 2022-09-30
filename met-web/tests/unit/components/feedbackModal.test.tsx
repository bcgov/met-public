import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { setupEnv } from './setEnvVars';
import { FeedbackModal } from 'components/common/Modals/FeedbackModal';

describe('Feedback modal tests', () => {
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
});
