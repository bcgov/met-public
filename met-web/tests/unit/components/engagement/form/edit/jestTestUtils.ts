import { USER_ROLES } from 'services/userService/constants';
import '@testing-library/jest-dom';
import { Box } from '@mui/material';
import { draftEngagement, engagementMetadata, engagementSlugData } from '../../../factory';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as engagementMetadataService from 'services/engagementMetadataService';
import * as engagementSlugService from 'services/engagementSlugService';
import * as notificationModalSlice from 'services/notificationModalService/notificationModalSlice';
import * as widgetService from 'services/widgetService';

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

jest.mock('components/map', () => () => {
    return <Box></Box>;
});

jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useCreateWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useDeleteWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useSortWidgetsMutation: () => [jest.fn(() => Promise.resolve())],
}));

// Mocking window.location.pathname in Jest
Object.defineProperty(window, 'location', {
    value: {
        pathname: '/engagements/1/form',
    },
});

export const setupCommonMocks = () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    jest.spyOn(engagementMetadataService, 'getEngagementMetadata').mockReturnValue(Promise.resolve(engagementMetadata));
    jest.spyOn(engagementSlugService, 'getSlugByEngagementId').mockReturnValue(Promise.resolve(engagementSlugData));
    jest.spyOn(engagementService, 'getEngagement').mockReturnValue(Promise.resolve(draftEngagement));
    jest.spyOn(engagementService, 'patchEngagement').mockReturnValue(Promise.resolve(draftEngagement));
    jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([]));
    jest.spyOn(notificationModalSlice, 'openNotificationModal').mockImplementation(jest.fn());

    // ... any other common setup logic here
};
