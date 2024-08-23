import { render, waitFor, screen } from '@testing-library/react';
import React, { ReactNode } from 'react';
import '@testing-library/jest-dom';
import EngagementView from 'components/engagement/old-view';
import { Contact } from 'models/contact';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as engagementSlugService from 'services/engagementSlugService';
import { Widget, WidgetItem, WidgetType } from 'models/widget';
import { createDefaultSurvey, Survey } from 'models/survey';
import { draftEngagement } from '../factory';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { EngagementLoaderData } from 'components/engagement/public/view';
import { EngagementContent } from 'models/engagementContent';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

const mockContact: Contact = {
    id: 1,
    name: 'Jace',
    title: 'prince',
    phone_number: '123-123-1234',
    email: 'jace@gmail.com',
    address: 'Dragonstone, Westeros',
    bio: 'Jacaerys Targaryen is the son and heir of Rhaenyra Targaryen',
    avatar_filename: '',
    avatar_url: '',
};

const widgetItem: WidgetItem = {
    id: 1,
    widget_id: 1,
    widget_data_id: 1,
    sort_index: 1,
};

const whoIsListeningWidget: Widget = {
    id: 1,
    title: 'Who is Listening',
    widget_type_id: WidgetType.WhoIsListening,
    engagement_id: 1,
    items: [widgetItem],
};

const mockLocationData = { state: { open: true }, pathname: '', search: '', hash: '', key: '' };

jest.mock('hooks', () => ({
    ...jest.requireActual('hooks'),
    useAppSelector: jest.fn(() => true),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useMediaQuery: jest.fn(() => true),
}));

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));

const mockWidgetsRtkUnwrap = jest.fn(() => Promise.resolve([whoIsListeningWidget]));
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

const mockContactRtkUnwrap = jest.fn(() => Promise.resolve(mockContact));
const mockContactRtkTrigger = () => {
    return {
        unwrap: mockContactRtkUnwrap,
    };
};
export const mockContactRtkQuery = () => [mockContactRtkTrigger];

const mockLazyGetContactQuery = jest.fn(mockContactRtkQuery);
jest.mock('apiManager/apiSlices/contacts', () => ({
    ...jest.requireActual('apiManager/apiSlices/contacts'),
    useLazyGetContactQuery: () => [...mockLazyGetContactQuery()],
}));

jest.mock('components/map', () => () => {
    return <div></div>;
});

jest.mock('components/permissionsGate', () => ({
    ...jest.requireActual('components/permissionsGate'),
    PermissionsGate: ({ children }: { children: ReactNode }) => {
        return <>{children}</>;
    },
}));

jest.mock('axios');

const router = createMemoryRouter(
    [
        {
            path: '/engagements/:engagementId/',
            element: <EngagementView />,
        },
    ],
    {
        initialEntries: [`/engagements/${draftEngagement.id}/`],
    },
);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useRouteMatch: () => ({ url: '/engagements/create/form/' }),
    useRouteLoaderData: (routeId: string) => {
        if (routeId === 'single-engagement') {
            return {
                engagement: Promise.resolve(draftEngagement),
                metadata: Promise.resolve([]),
                widgets: Promise.resolve([whoIsListeningWidget]),
                content: Promise.resolve([
                    {
                        id: 1,
                        title: 'title',
                        text_content: 'text content',
                        json_content:
                            '{"blocks":[{"key":"fclgj","text":"Rich Content Sample","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
                        engagement_id: 1,
                        content: 'content',
                        sort_index: 1,
                        is_internal: false,
                    } as EngagementContent,
                ]),
            };
        }
    },
}));

describe('Engagement View page tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useLocation').mockReturnValue(mockLocationData);
    jest.spyOn(reactRouter, 'useParams').mockReturnValue({ engagementId: '1' });
    jest.spyOn(engagementSlugService, 'getSlugByEngagementId').mockResolvedValue({ slug: 'slug' });
    const getEngagementMock = jest.spyOn(engagementService, 'getEngagement').mockResolvedValue(draftEngagement);

    beforeEach(() => {
        setupEnv();
    });

    test('Look at Engagement view', async () => {
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        render(<RouterProvider router={router} />);
        await waitFor(() => {
            expect(screen.getByTestId(`engagement-content`)).toBeVisible();
        });
    });

    test('Widget block appears', async () => {
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getByTestId(`widget-block`)).toBeVisible();
        });
    });

    test('Who is listening widget appears', async () => {
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([whoIsListeningWidget]));
        mockContactRtkUnwrap.mockReturnValueOnce(Promise.resolve(mockContact));
        const { container } = render(<RouterProvider router={router} />);
        screen.debug(undefined, 10000);
        await waitFor(() => {
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
            expect(screen.getByText('Who is Listening')).toBeVisible();
        });

        expect(screen.getByText(mockContact.name)).toBeVisible();
        expect(screen.getByText(mockContact.email)).toBeVisible();
    });
});
