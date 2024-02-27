import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import * as widgetService from 'services/widgetService';
import { WidgetType } from 'models/widget';
import { draftEngagement, subscribeWidget } from '../factory';
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

const mockCreateWidget = jest.fn(() => Promise.resolve(subscribeWidget));

jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useCreateWidgetMutation: () => [mockCreateWidget],
    useCreateWidgetItemsMutation: () => [mockCreateWidget],
    useUpdateWidgetMutation: () => [jest.fn(() => Promise.resolve(subscribeWidget))],
    useDeleteWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useSortWidgetsMutation: () => [jest.fn(() => Promise.resolve())],
}));

// Mock the necessary services and contexts
jest.mock('services/subscriptionService', () => ({
    postSubscribeForm: jest.fn(),
}));

describe('Subscribe Widget tests', () => {
    beforeAll(() => {
        setupWidgetTestEnvMock();
        setupWidgetTestEnvSpy();
        jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([subscribeWidget]));
    });

    async function addSubscribeWidget() {
        await waitFor(() => expect(screen.getByText('Add Widget')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Add Widget'));
        await waitFor(() => expect(screen.getByText('Select Widget')).toBeVisible());
        fireEvent.click(screen.getByTestId(`widget-drawer-option/${WidgetType.Subscribe}`));
        await waitFor(() => {
            expect(screen.getByText('Email List')).toBeVisible();
            expect(screen.getByText('Form Sign-up')).toBeVisible();
        });
    }

    async function inputMockSubscribeData() {
        const callToActionText = document.querySelector('input[name="callToActionText"]') as HTMLInputElement;
        const richTextEditorDesc = document.querySelector('[contenteditable="true"]') as HTMLInputElement;

        const linkRadioButton = screen.getByLabelText('Link');
        const buttonRadioButton = screen.getByLabelText('Button');

        // Simulate typing into the rich text editor
        richTextEditorDesc.textContent = 'Your desired text';
        // Manually dispatch an 'input' event
        const inputEvent = new Event('input', { bubbles: true });
        richTextEditorDesc.dispatchEvent(inputEvent);

        fireEvent.change(callToActionText, { target: { value: 'Click here' } });
        fireEvent.click(linkRadioButton);

        await waitFor(() => {
            expect(richTextEditorDesc.textContent).toBe('Your desired text');
            expect(callToActionText.value).toBe('Click here');
            // Check if the "Link" radio button is selected
            expect(linkRadioButton).toBeChecked();
            // Check if the "Button" radio button is not selected
            expect(buttonRadioButton).not.toBeChecked();
        });
    }

    async function selectEmailList() {
        const emailListButton = screen.getByRole('button', { name: 'Email List' });
        fireEvent.click(emailListButton);
        await waitFor(() => {
            expect(screen.getByText('Description')).toBeVisible();
            expect(screen.getByText('Call-to-action Type')).toBeVisible();
        });
    }

    async function selectFormSignUp() {
        const formSignUpButton = screen.getByRole('button', { name: 'Form Sign-up' });
        fireEvent.click(formSignUpButton);
        await waitFor(() => {
            expect(screen.getByText('Description')).toBeVisible();
            expect(screen.getByText('Call-to-action Type')).toBeVisible();
        });
    }

    test('Subscribe widget is created when option is clicked', async () => {
        render(<EngagementForm />);
        const getWidgetsMock = jest
            .spyOn(widgetService, 'getWidgets')
            .mockReturnValue(Promise.resolve([subscribeWidget]));

        await addSubscribeWidget();

        expect(getWidgetsMock).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Email List')).toBeVisible();
        expect(screen.getByText('Form Sign-up')).toBeVisible();
    });

    test('Subscribe widget Email List handles input correctly', async () => {
        render(<EngagementForm />);
        await addSubscribeWidget();
        await selectEmailList();
        await inputMockSubscribeData();
    });

    test('Subscribe widget Form sign up handles input correctly', async () => {
        render(<EngagementForm />);
        await addSubscribeWidget();
        await selectFormSignUp();
        await inputMockSubscribeData();
    });
});
