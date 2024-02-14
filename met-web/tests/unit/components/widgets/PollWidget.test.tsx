import { render, waitFor, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as widgetService from 'services/widgetService';
import * as engagementMetadataService from 'services/engagementMetadataService';
import * as membershipService from 'services/membershipService';
import * as engagementSettingService from 'services/engagementSettingService';
import * as PollService from 'services/widgetService/PollService';
import { Box } from '@mui/material';
import { WidgetType } from 'models/widget';
import { draftEngagement, surveys, mockPoll, pollWidget, engagementMetadata } from '../factory';
import { USER_ROLES } from 'services/userService/constants';
import { EngagementSettings, createDefaultEngagementSettings } from 'models/engagement';

jest.mock('components/map', () => () => <div></div>);

const mockEngagementSettings: EngagementSettings = {
    ...createDefaultEngagementSettings(),
};

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
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ search: '' })),
    useParams: jest.fn(() => {
        return { projectId: '' };
    }),
    useNavigate: () => jest.fn(),
}));
jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));

jest.mock('components/common/Dragdrop', () => ({
    ...jest.requireActual('components/common/Dragdrop'),
    MetDroppable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
    MetDraggable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));
jest.mock('@hello-pangea/dnd', () => ({
    ...jest.requireActual('@hello-pangea/dnd'),
    DragDropContext: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
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
jest.spyOn(engagementMetadataService, 'getEngagementMetadata').mockReturnValue(Promise.resolve(engagementMetadata));

// Mock the necessary services and contexts
jest.mock('services/widgetService/PollService', () => ({
    postPoll: jest.fn(),
    patchPoll: jest.fn(),
}));

describe('Poll Widget tests', () => {
    beforeAll(() => {
        jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => ({
            roles: [USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS, USER_ROLES.EDIT_ENGAGEMENT, USER_ROLES.CREATE_ENGAGEMENT],
            assignedEngagements: [draftEngagement.id],
        }));
        jest.spyOn(reactRouter, 'useParams').mockReturnValue({ projectId: '' });
        jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(jest.fn());
        jest.spyOn(engagementService, 'getEngagement').mockReturnValue(Promise.resolve(draftEngagement));
        jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([pollWidget]));
        jest.spyOn(engagementMetadataService, 'getEngagementMetadata').mockReturnValue(
            Promise.resolve(engagementMetadata),
        );
        jest.spyOn(membershipService, 'getTeamMembers').mockReturnValue(Promise.resolve([]));
        jest.spyOn(engagementSettingService, 'getEngagementSettings').mockReturnValue(
            Promise.resolve(mockEngagementSettings),
        );
        jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(jest.fn());
        setupEnv();
    });

    async function addPollWidget() {
        await waitFor(() => expect(screen.getByText('Add Widget')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Add Widget'));
        await waitFor(() => expect(screen.getByText('Select Widget')).toBeVisible());
        fireEvent.click(screen.getByTestId(`widget-drawer-option/${WidgetType.Poll}`));
        await waitFor(() => {
            expect(screen.getByText('Poll Answers')).toBeVisible();
        });
    }

    async function inputMockPollData() {
        const titleInput = within(screen.getByTestId('title')).getByRole('textbox') as HTMLInputElement;
        const descInput = within(screen.getByTestId('description')).getByRole('textbox') as HTMLInputElement;
        const answerText1 = within(screen.getByTestId('answerText1')).getByRole('textbox') as HTMLInputElement;
        const statusButton = screen.getByTestId('status') as HTMLInputElement;
        const addAnswerButton = screen.getByText('Add Answer');

        fireEvent.change(titleInput, { target: { value: mockPoll.title } });
        fireEvent.change(descInput, { target: { value: mockPoll.description } });
        fireEvent.change(answerText1, { target: { value: mockPoll.answers[0].answer_text } });

        fireEvent.mouseDown(statusButton);
        const activeOption = screen.getByText('Active');
        fireEvent.click(activeOption);

        fireEvent.click(addAnswerButton);
        const answerText2 = within(screen.getByTestId('answerText2')).getByRole('textbox') as HTMLInputElement;
        fireEvent.change(answerText2, { target: { value: mockPoll.answers[1].answer_text } });

        // Find the parent element of the Select component using the data-testid
        const selectParent = screen.getByTestId('status').parentElement;

        // Find the hidden input within this parent element
        const hiddenInput = selectParent?.querySelector('input[name="status"]') as HTMLInputElement;


        await waitFor(() => {
            expect(titleInput.value).toBe(mockPoll.title);
            expect(descInput.value).toBe(mockPoll.description);
            expect(answerText1.value).toBe(mockPoll.answers[0].answer_text);
            expect(answerText2.value).toBe(mockPoll.answers[1].answer_text);
            expect(hiddenInput.value).toBe('active');
        });
    }

    test('Poll widget is created when option is clicked', async () => {
        render(<EngagementForm />);
        const getWidgetsMock = jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([pollWidget]));

        await addPollWidget();

        expect(getWidgetsMock).toHaveBeenCalledTimes(1);

        expect(screen.getByText('Title')).toBeVisible();
        expect(screen.getByText('Description')).toBeVisible();
    });

    test('Multiple answers can be added on Poll widget', async () => {
        render(<EngagementForm />);
        await addPollWidget();

        const addAnswerButton = screen.getByText('Add Answer');
        fireEvent.click(addAnswerButton);
        fireEvent.click(addAnswerButton);

        await waitFor(() => {
            expect(screen.getByText('Answer Text 2')).toBeVisible();
            expect(screen.getByText('Answer Text 3')).toBeVisible();
        });
    });

    test('Poll widget handles input correctly', async () => {
        render(<EngagementForm />);
        await addPollWidget();
        await inputMockPollData();
    });

    test('Poll can be submitted after inputting mock data', async () => {
        render(<EngagementForm />);

        await addPollWidget();
        await inputMockPollData();

        const submitButton = screen.getByTestId('save-button');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(PollService.postPoll).toHaveBeenCalledTimes(1);
        });
    });
});
