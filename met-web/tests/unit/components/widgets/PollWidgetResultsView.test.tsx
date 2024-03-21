import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import * as widgetService from 'services/widgetService';
import * as pollService from 'services/widgetService/PollService';
import { draftEngagement, pollWidget } from '../factory';
import { USER_ROLES } from 'services/userService/constants';
import { setupWidgetTestEnvMock, setupWidgetTestEnvSpy } from './setupWidgetTestEnv';

jest.mock('components/map', () => () => <div></div>);
jest.mock('axios');
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => {
        return {
            roles: [USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS, USER_ROLES.EDIT_ENGAGEMENT, USER_ROLES.CREATE_ENGAGEMENT],
            assignedEngagements: [draftEngagement.id],
        };
    }),
}));
const mockCreateWidget = jest.fn(() => Promise.resolve(pollWidget));

jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useCreateWidgetMutation: () => [mockCreateWidget],
    useCreateWidgetItemsMutation: () => [mockCreateWidget],
    useUpdateWidgetMutation: () => [jest.fn(() => Promise.resolve(pollWidget))],
    useDeleteWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useSortWidgetsMutation: () => [jest.fn(() => Promise.resolve())],
}));

describe('Poll Widget tests', () => {
    const mockPoll = {
        id: 1,
        widget_id: pollWidget.id,
        engagement_id: draftEngagement.id,
        title: 'Test Poll',
        description: 'Description',
        status: 'active',
        answers: [
            { id: 1, answer_text: 'Option 1' },
            { id: 2, answer_text: 'Option 2' },
            { id: 3, answer_text: 'Option 3' },
        ],
    };

    const mockPollResult = {
        poll_id: mockPoll.id,
        title: mockPoll.title,
        description: mockPoll.description,
        total_response: 4,
        answers: [
            { answer_id: 1, answer_text: 'Option 1', total_response: 2, percentage: 50 },
            { answer_id: 2, answer_text: 'Option 2', total_response: 2, percentage: 50 },
            { answer_id: 3, answer_text: 'Option 3', total_response: 0, percentage: 0 },
        ],
    };

    beforeAll(() => {
        setupWidgetTestEnvMock();
        setupWidgetTestEnvSpy();
        jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([pollWidget]));
        jest.spyOn(pollService, 'fetchPollWidgets').mockReturnValue(Promise.resolve([mockPoll]));
        jest.spyOn(pollService, 'fetchPollResults').mockReturnValue(Promise.resolve(mockPollResult));
    });

    async function renderPollWidgetView() {
        await waitFor(() => expect(screen.getByText('Results')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Results'));
        expect(screen.getByText('Poll')).toBeVisible();
        await waitFor(() => expect(screen.getByText('Test Poll')).toBeInTheDocument());
    }

    test('Poll widget results is rendered', async () => {
        render(<EngagementForm />);
        await renderPollWidgetView();
        expect(screen.getByText(mockPollResult.description)).toBeVisible();
        expect(screen.getByText('Total Votes: 4')).toBeVisible();
    });

    test('Poll widget answer options and its percentage is rendered', async () => {
        render(<EngagementForm />);
        await renderPollWidgetView();
        expect(screen.getByText(mockPollResult.answers[0].answer_text)).toBeVisible();
        expect(screen.getByText(mockPollResult.answers[1].answer_text)).toBeVisible();
        const twoVotes = screen.getAllByText('2 votes');
        expect(twoVotes.length).toBe(2);
        expect(twoVotes[0]).toBeVisible();
        expect(twoVotes[1]).toBeVisible();
        expect(screen.getByText('0 vote')).toBeVisible();
        expect(screen.getByText('0%')).toBeVisible();
        const fiftyPercent = screen.getAllByText('50%');
        expect(fiftyPercent.length).toBe(2);
        expect(fiftyPercent[0]).toBeVisible();
        expect(fiftyPercent[1]).toBeVisible();
    });
});
