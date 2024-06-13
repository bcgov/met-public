import React, { ReactNode, SuspenseProps } from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as tenantService from 'services/tenantService';
import TenantDetail from '../../../../src/components/tenantManagement/Detail';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { USER_ROLES } from 'services/userService/constants';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';

global['Request'] = jest.fn().mockImplementation(() => ({
    signal: {
        removeEventListener: () => {},
        addEventListener: () => {},
    },
}));

const mockTenant = {
    id: 1,
    name: 'Tenant One',
    title: 'Title One',
    description: 'Description One',
    contact_name: 'Contact One',
    short_name: 'tenantone',
    contact_email: 'contactone@example.com',
    logo_url: 'https://example.com/logo.png',
    logo_credit: 'Photographer One',
    logo_description: 'Logo Description One',
};

jest.mock('axios');

jest.mock('react', () => ({
    //this makes the suspense component render its children immediately
    ...jest.requireActual('react'),
    Suspense: jest.fn(({ children, fallback }: { children: ReactNode; fallback: ReactNode }) => {
        return children;
    }),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Grid: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Skeleton: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('components/common/Typography/', () => ({
    Header1: ({ children }: { children: ReactNode }) => <h1>{children}</h1>,
    Header2: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
    BodyText: ({ children }: { children: ReactNode }) => <p>{children}</p>,
}));

jest.mock('components/common/Layout', () => ({
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    DetailsContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Detail: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => {
        return {
            roles: [USER_ROLES.SUPER_ADMIN],
        };
    }),
    useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => {
        return { tenantId: mockTenant.short_name };
    }),
    useNavigate: jest.fn(),
    useRouteLoaderData: jest.fn(() => ({
        tenant: mockTenant,
    })),
}));

jest.mock('services/tenantService', () => ({
    deleteTenant: jest.fn(),
}));

jest.mock('services/notificationService/notificationSlice', () => ({
    openNotification: jest.fn(),
}));

let capturedNotification: any;
jest.mock('services/notificationModalService/notificationModalSlice', () => ({
    openNotificationModal: jest.fn((notification: any) => {
        capturedNotification = notification;
    }),
}));

// Mocking AutoBreadcrumbs component
jest.mock('components/common/Navigation/Breadcrumb', () => ({
    AutoBreadcrumbs: () => <div>Breadcrumbs</div>,
}));

const router = createMemoryRouter(
    [
        {
            path: '/tenantadmin/:tenantId/detail',
            element: <TenantDetail />,
            id: 'tenant',
        },
    ],
    { initialEntries: ['/tenantadmin/1/detail'] },
);

describe('Tenant Detail Page tests', () => {
    const dispatch = jest.fn();
    const navigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(dispatch);
        jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigate);
    });

    test('Tenant detail is rendered', async () => {
        render(<RouterProvider router={router} />);
        await waitFor(() => {
            const tenantNames = screen.getAllByText('Tenant One');
            expect(tenantNames).toHaveLength(2);
            expect(screen.getByText('Title One')).toBeVisible();
            expect(screen.getByText('Description One')).toBeVisible();
            expect(screen.getByText('Contact One')).toBeVisible();
            expect(screen.getByText('contactone@example.com')).toBeVisible();
            expect(screen.getByText('Photographer One')).toBeVisible();
            expect(screen.getByText('Logo Description One')).toBeVisible();

            expect(screen.getByText('Edit')).toBeVisible();
            expect(screen.getByText('Delete Tenant Instance')).toBeVisible();
        });
    });

    test('Delete popup works as expected', async () => {
        render(<RouterProvider router={router} />);
        await waitFor(() => {
            screen.getByText('Delete Tenant Instance').click();
        });
        await waitFor(() => {
            expect(openNotificationModal).toHaveBeenCalledTimes(1);
            expect(capturedNotification.data.header).toBe('Delete Tenant Instance?');
            capturedNotification.data.handleConfirm();
            // Test that the deleteTenant function was called
            expect(tenantService.deleteTenant).toHaveBeenCalledTimes(1);
        });
    });

    test('Loading state is rendered', () => {
        // Re-mock the Suspense component to render the fallback prop
        jest.spyOn(React, 'Suspense').mockImplementation((props: SuspenseProps) => {
            return props.fallback as JSX.Element;
        });
        render(<RouterProvider router={router} />);
        const loadingTexts = screen.getAllByText('Loading...');
        expect(loadingTexts.length).toBeGreaterThan(0);
    });
});
