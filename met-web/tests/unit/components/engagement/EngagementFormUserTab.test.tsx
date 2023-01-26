import React, { ReactNode } from 'react';
import { render, waitFor, screen, fireEvent, within, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as teamMemberService from 'services/engagementService/TeamMemberService';
import * as notificationModalSlice from 'services/notificationModalService/notificationModalSlice';
import * as userService from 'services/userService/api';
import { Box } from '@mui/material';
import { engagement } from '../factory';
import { User, initialDefaultUser, USER_GROUP } from 'models/user';
import { EngagementTeamMember, initialDefaultTeamMember } from 'models/engagementTeamMember';

const mockUser1: User = {
    ...initialDefaultUser,
    id: 2,
    first_name: 'John',
    last_name: 'Snow',
    groups: [USER_GROUP.VIEWER.label],
};

const mockTeamMember1: EngagementTeamMember = {
    ...initialDefaultTeamMember,
    user_id: 1,
    user: {
        ...initialDefaultUser,
        id: 1,
        first_name: 'Jane',
        last_name: 'Doe',
        groups: [USER_GROUP.VIEWER.label],
    },
};

const mockTeamMember2: EngagementTeamMember = {
    ...initialDefaultTeamMember,
    user_id: 2,
    user: {
        ...mockUser1,
    },
};

jest.mock('components/common/Dragdrop', () => ({
    ...jest.requireActual('components/common/Dragdrop'),
    MetDroppable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
    MetDraggable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

jest.mock('@hello-pangea/dnd', () => ({
    ...jest.requireActual('@hello-pangea/dnd'),
    DragDropContext: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Link: ({ children }: { children: ReactNode }) => {
        return <a>{children}</a>;
    },
}));

const mockWidgetsRtkUnwrap = jest.fn(() => Promise.resolve([]));
const mockWidgetsRtkTrigger = () => {
    return {
        unwrap: mockWidgetsRtkUnwrap,
    };
};
export const mockWidgetsRtkQuery = () => [mockWidgetsRtkTrigger];

const mockLazyGetWidgetsQuery = jest.fn(mockWidgetsRtkQuery);
jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useLazyGetWidgetsQuery: () => [...mockLazyGetWidgetsQuery()],
}));

describe('Engagement form page tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    jest.spyOn(userService, 'getUserList').mockReturnValue(
        Promise.resolve({
            items: [mockUser1],
            total: 1,
        }),
    );
    jest.spyOn(teamMemberService, 'getTeamMembers').mockReturnValue(Promise.resolve([mockTeamMember1]));
    const addTeamMemberToEngagementMock = jest
        .spyOn(teamMemberService, 'addTeamMemberToEngagement')
        .mockReturnValue(Promise.resolve(mockTeamMember2));

    const openNotificationModalMock = jest
        .spyOn(notificationModalSlice, 'openNotificationModal')
        .mockImplementation(jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    jest.spyOn(engagementService, 'getEngagement').mockReturnValue(Promise.resolve(engagement));

    beforeEach(() => {
        setupEnv();
    });

    test('User management tab renders and team member added', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue(engagement.name)).toBeInTheDocument();
        });
        await waitForElementToBeRemoved(container.querySelector('span.MuiSkeleton-root'));

        const userManagementTabButton = screen.getByText('User Management');

        fireEvent.click(userManagementTabButton);

        await waitFor(() => {
            expect(screen.getByText(mockTeamMember1.user.first_name, { exact: false })).toBeInTheDocument();
        });

        const addTeamMemberButton = screen.getByText('+ Add Team Member');
        expect(addTeamMemberButton).toBeInTheDocument();

        fireEvent.click(addTeamMemberButton);

        await waitFor(() => {
            expect(screen.getByText('Select the user you want to add')).toBeInTheDocument();
        });

        const autocomplete = screen.getByTestId('select-team-member');
        const input = within(autocomplete).getByRole('combobox');

        autocomplete.focus();
        fireEvent.change(input, { target: { value: mockUser1.first_name } });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter' });

        await waitFor(() => {
            expect(input).toHaveValue(`${mockUser1.first_name} ${mockUser1.last_name}`);
        });
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(addTeamMemberToEngagementMock).toBeCalled();
            expect(openNotificationModalMock).toBeCalled();
        });
    });
});
