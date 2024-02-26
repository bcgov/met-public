import React from 'react';
import { act, render, waitFor, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PollWidgetView from 'components/engagement/view/widgets/Poll/PollWidgetView';
import * as widgetService from 'services/widgetService/PollService';
import * as notificationService from 'services/notificationService/notificationSlice';
import * as reactRedux from 'react-redux';

// Mock for useDispatch
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());

// Mock for useSubmittedPolls
jest.mock('hooks', () => ({
    // mock useAppSelector
    useAppSelector: (callback: any) =>
        callback({
            user: {
                authentication: {
                    authenticated: false,
                },
            },
        }),
    useAppDispatch: () => jest.fn(),
    useSubmittedPolls: () => ({
        getSubmittedPolls: jest.fn().mockReturnValue([]),
        addSubmittedPoll: jest.fn(),
    }),
}));

jest.mock('services/widgetService/PollService', () => ({
    fetchPollWidgets: jest.fn(),
    postPollResponse: jest.fn(),
}));

jest.mock('services/notificationService/notificationSlice', () => ({
    openNotification: jest.fn(),
}));

describe('PollWidgetView Component Tests', () => {
    const widget = {
        id: 1,
        title: 'Sample Poll',
        widget_type_id: 10,
        engagement_id: 1,
        items: [],
    };

    const mockPoll = {
        id: 1,
        widget_id: 1,
        engagement_id: 1,
        title: 'Test Poll',
        description: 'Description',
        status: 'active',
        answers: [
            { id: 1, answer_text: 'Option 1' },
            { id: 2, answer_text: 'Option 2' },
        ],
    };

    beforeEach(() => {
        jest.spyOn(widgetService, 'fetchPollWidgets').mockReturnValue(Promise.resolve([mockPoll]));
    });

    test('renders poll details on successful data fetch', async () => {
        await act(async () => {
            render(<PollWidgetView widget={widget} />);
        });

        await waitFor(() => {
            expect(screen.getByText(mockPoll.title)).toBeInTheDocument();
            expect(screen.getByText(mockPoll.description)).toBeInTheDocument();
            expect(screen.getByText(mockPoll.answers[0].answer_text)).toBeInTheDocument();
            expect(screen.getByText('Submit')).toBeInTheDocument();
        });
    });

    test('displays error notification on fetch failure', async () => {
        jest.spyOn(widgetService, 'fetchPollWidgets').mockRejectedValue(new Error('Fetch Error'));
        await act(async () => {
            render(<PollWidgetView widget={widget} />);
        });

        await waitFor(() => {
            expect(notificationService.openNotification).toHaveBeenCalledWith({
                severity: 'error',
                text: 'Error occurred while fetching Engagement widgets information',
            });
        });
    });

    test('submits poll response and displays success message', async () => {
        jest.spyOn(widgetService, 'postPollResponse').mockResolvedValue({ selected_answer_id: '1' });
        await act(async () => {
            render(<PollWidgetView widget={widget} />);
        });

        const optionRadioButton = screen.getByLabelText(mockPoll.answers[0].answer_text);
        fireEvent.click(optionRadioButton);

        expect(optionRadioButton).toBeChecked();

        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => {
            expect(widgetService.postPollResponse).toHaveBeenCalled();
            expect(screen.getByText('Thank you for the response.')).toBeInTheDocument();
        });
    });

    test('displays error message on submission failure', async () => {
        jest.spyOn(widgetService, 'postPollResponse').mockRejectedValue({
            response: { status: 400 },
        });
        await act(async () => {
            render(<PollWidgetView widget={widget} />);
        });

        const optionRadioButton = screen.getByLabelText(mockPoll.answers[0].answer_text);
        fireEvent.click(optionRadioButton);

        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => {
            expect(screen.getByText('An error occurred.')).toBeInTheDocument();
        });
    });
});
