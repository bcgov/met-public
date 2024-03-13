import React, { ReactNode } from 'react';
import { render, waitFor, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as engagementMetadataService from 'services/engagementMetadataService';
import * as engagementSettingService from 'services/engagementSettingService';
import * as teamMemberService from 'services/membershipService';
import * as widgetService from 'services/widgetService';
import { Box } from '@mui/material';
import { draftEngagement, engagementMetadata, engagementSetting } from '../factory';
import { createDefaultUser, USER_COMPOSITE_ROLE } from 'models/user';
import { EngagementTeamMember, initialDefaultTeamMember } from 'models/engagementTeamMember';
import { USER_ROLES } from 'services/userService/constants';

const mockTeamMember1: EngagementTeamMember = {
    ...initialDefaultTeamMember,
    user_id: 1,
    user: {
        ...createDefaultUser,
        id: 1,
        first_name: 'Jane',
        last_name: 'Doe',
        composite_roles: [USER_COMPOSITE_ROLE.VIEWER.label],
    },
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

jest.mock('components/map', () => () => {
    return <div></div>;
});

jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useDeleteWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useSortWidgetsMutation: () => [jest.fn(() => Promise.resolve())],
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ search: '' })),
    useParams: jest.fn(() => {
        return { projectId: '' };
    }),
    useNavigate: () => jest.fn(),
}));

describe('Engagement form page tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(teamMemberService, 'getTeamMembers').mockReturnValue(Promise.resolve([mockTeamMember1]));
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    jest.spyOn(engagementService, 'getEngagement').mockReturnValue(Promise.resolve(draftEngagement));
    jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([]));
    jest.spyOn(engagementMetadataService, 'getEngagementMetadata').mockReturnValue(
        Promise.resolve([engagementMetadata]),
    );
    jest.spyOn(engagementSettingService, 'getEngagementSettings').mockReturnValue(Promise.resolve(engagementSetting));

    beforeEach(() => {
        setupEnv();
    });

    test('User management tab renders', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue(draftEngagement.name)).toBeInTheDocument();
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
            expect(screen.getByText('Select the Team Member you want to add')).toBeInTheDocument();
        });
    });
});
