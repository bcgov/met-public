import React from 'react';
import { USER_ROLES } from 'services/userService/constants';
import '@testing-library/jest-dom';
import { draftEngagement, engagementMetadata, engagementSlugData } from '../../../factory';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as engagementMetadataService from 'services/engagementMetadataService';
import * as engagementSlugService from 'services/engagementSlugService';
import * as notificationModalSlice from 'services/notificationModalService/notificationModalSlice';
import { Box } from '@mui/material';

export const setupCommonMocks = () => {
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
        MetDroppable: ({ children }: { children: React.ReactNode }) => {
            return <Box>{children}</Box>;
        },
        MetDraggable: ({ children }: { children: React.ReactNode }) => {
            return <Box>{children}</Box>;
        },
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

    Object.defineProperty(window, 'location', {
        value: {
            pathname: '/engagements/1/form',
        },
    });

    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    const useNavigateMock = jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMetadataMock = jest
        .spyOn(engagementMetadataService, 'getEngagementMetadata')
        .mockReturnValue(Promise.resolve(engagementMetadata));
    const getSlugByEngagementIdMock = jest
        .spyOn(engagementSlugService, 'getSlugByEngagementId')
        .mockReturnValue(Promise.resolve(engagementSlugData));
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    const patchEngagementMock = jest
        .spyOn(engagementService, 'patchEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    const openNotificationModalMock = jest
        .spyOn(notificationModalSlice, 'openNotificationModal')
        .mockImplementation(jest.fn());

    return {
        useDispatchMock,
        useNavigateMock,
        getEngagementMetadataMock,
        getSlugByEngagementIdMock,
        getEngagementMock,
        patchEngagementMock,
        openNotificationModalMock,
        useParamsMock,
    };
};
