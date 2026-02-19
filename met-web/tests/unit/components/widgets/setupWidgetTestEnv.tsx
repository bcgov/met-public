import { setupEnv } from '../setEnvVars';
import React from 'react';
import '@testing-library/jest-dom';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as engagementMetadataService from 'services/engagementMetadataService';
import * as membershipService from 'services/membershipService';
import * as engagementSettingService from 'services/engagementSettingService';
import { USER_ROLES } from 'services/userService/constants';
import { draftEngagement, engagementMetadata } from '../factory';
import { EngagementSettings, createDefaultEngagementSettings } from 'models/engagement';
import { Box } from '@mui/material';

const mockEngagementSettings: EngagementSettings = {
    ...createDefaultEngagementSettings(),
};

export const setupWidgetTestEnvMock = (): void => {
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
    jest.mock('react-router', () => ({
        ...jest.requireActual('react-router'),
        useLocation: jest.fn(() => ({ search: '' })),
        useParams: jest.fn(() => {
            return { projectId: '' };
        }),
        useNavigate: () => jest.fn(),
    }));
};

export const setupWidgetTestEnvSpy = (): void => {
    setupEnv();

    jest.spyOn(engagementMetadataService, 'getEngagementMetadata').mockReturnValue(
        Promise.resolve([engagementMetadata]),
    );

    jest.mock('react-redux', () => ({
        ...jest.requireActual('react-redux'),
        useSelector: jest.fn((callback) =>
            callback({
                user: {
                    roles: [
                        USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS,
                        USER_ROLES.EDIT_ENGAGEMENT,
                        USER_ROLES.CREATE_ENGAGEMENT,
                    ],
                },
                assignedEngagements: [draftEngagement.id],
            }),
        ),
        useDispatch: jest.fn(() => jest.fn()),
    }));
    jest.spyOn(engagementService, 'getEngagement').mockReturnValue(Promise.resolve(draftEngagement));
    jest.spyOn(engagementMetadataService, 'getEngagementMetadata').mockReturnValue(
        Promise.resolve([engagementMetadata]),
    );
    jest.spyOn(membershipService, 'getTeamMembers').mockReturnValue(Promise.resolve([]));
    jest.spyOn(engagementSettingService, 'getEngagementSettings').mockReturnValue(
        Promise.resolve(mockEngagementSettings),
    );
};
