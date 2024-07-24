import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import * as widgetService from 'services/widgetService';
import * as engagementMetadataService from 'services/engagementMetadataService';
import * as VideoService from 'services/widgetService/VideoService';
import { WidgetType } from 'models/widget';
import { draftEngagement, mockVideo, videoWidget, engagementMetadata } from '../factory';
import { USER_ROLES } from 'services/userService/constants';
import { setupWidgetTestEnvMock, setupWidgetTestEnvSpy } from './setupWidgetTestEnv';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

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

const mockCreateWidget = jest.fn(() => Promise.resolve(videoWidget));

jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useCreateWidgetMutation: () => [mockCreateWidget],
    useCreateWidgetItemsMutation: () => [mockCreateWidget],
    useUpdateWidgetMutation: () => [jest.fn(() => Promise.resolve(videoWidget))],
    useDeleteWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useSortWidgetsMutation: () => [jest.fn(() => Promise.resolve())],
}));
jest.spyOn(engagementMetadataService, 'getEngagementMetadata').mockReturnValue(Promise.resolve([engagementMetadata]));

// Mock the necessary services and contexts
jest.mock('services/widgetService/VideoService', () => ({
    postVideo: jest.fn(),
    patchVideo: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ search: '' })),
    useParams: jest.fn(() => {
        return { projectId: '', engagementId: '1' };
    }),
    useNavigate: () => jest.fn(),
    useRouteLoaderData: (routeId: string) => {
        if (routeId === 'single-engagement') {
            return {
                engagement: Promise.resolve({
                    ...draftEngagement,
                }),
                widgets: Promise.resolve([videoWidget]),
                metadata: Promise.resolve([]),
                content: Promise.resolve([]),
                taxa: Promise.resolve([]),
            };
        }
    },
}));

const router = createMemoryRouter(
    [
        {
            path: '/engagements/:engagementId/form/',
            element: <EngagementForm />,
        },
    ],
    {
        initialEntries: [`/engagements/${draftEngagement.id}/form/`],
    },
);

describe('Video Widget tests', () => {
    beforeAll(() => {
        setupWidgetTestEnvMock();
        setupWidgetTestEnvSpy();
        jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([videoWidget]));
    });

    async function addVideoWidget() {
        await waitFor(() => expect(screen.getByText('Add Widget')).toBeEnabled());
        fireEvent.click(screen.getByText('Add Widget'));
        await waitFor(() => expect(screen.getByText('Select Widget')).toBeVisible());
        fireEvent.click(screen.getByTestId(`widget-drawer-option/${WidgetType.Video}`));
        await waitFor(() => {
            expect(screen.getByText('Description')).toBeVisible();
        });
    }

    async function inputMockVideodata() {
        const linkInput = document.querySelector('input[name="videoUrl"]') as HTMLInputElement;
        const descInput = document.querySelector('textarea[name="description"]') as HTMLInputElement;

        fireEvent.change(linkInput, { target: { value: mockVideo.video_url } });
        fireEvent.change(descInput, { target: { value: mockVideo.description } });

        await waitFor(() => {
            expect(linkInput.value).toBe(mockVideo.video_url);
            expect(descInput.value).toBe(mockVideo.description);
        });
    }

    test('Video widget is created when option is clicked', async () => {
        render(<RouterProvider router={router} />);
        const getWidgetsMock = jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([videoWidget]));

        await addVideoWidget();

        expect(getWidgetsMock).toHaveBeenCalled();
        expect(screen.getByText('Description')).toBeVisible();
        expect(screen.getByText('Video Link')).toBeVisible();
    });

    test('Video widget handles input correctly', async () => {
        render(<RouterProvider router={router} />);
        await addVideoWidget();
        await inputMockVideodata();
    });

    test('Video can be submitted after inputting mock data', async () => {
        render(<RouterProvider router={router} />);

        await addVideoWidget();
        await inputMockVideodata();

        const submitButton = screen.getByRole('button', { name: 'Save & Close' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(VideoService.postVideo).toHaveBeenCalledTimes(1);
        });
    });
});
