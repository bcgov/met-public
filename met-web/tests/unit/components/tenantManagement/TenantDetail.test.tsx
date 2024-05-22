import React, { ReactNode } from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as tenantService from 'services/tenantService';
import TenantDetail from '../../../../src/components/tenantManagement/Detail';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { USER_ROLES } from 'services/userService/constants';

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
}));

jest.mock('services/tenantService', () => ({
    getTenant: jest.fn(),
    deleteTenant: jest.fn(),
}));

jest.mock('services/notificationService/notificationSlice', () => ({
    openNotification: jest.fn(),
}));

jest.mock('services/notificationModalService/notificationModalSlice', () => ({
    openNotificationModal: jest.fn(),
}));

// Mocking BreadcrumbTrail component
jest.mock('components/common/Navigation/Breadcrumb', () => ({
    BreadcrumbTrail: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('Tenant Detail Page tests', () => {
    const dispatch = jest.fn();
    const navigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(dispatch);
        jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigate);
        jest.spyOn(tenantService, 'getTenant').mockResolvedValue(mockTenant);
    });

    test('Tenant detail is rendered', async () => {
        render(
            <MemoryRouter initialEntries={['/tenantadmin/1/detail']}>
                <Routes>
                    <Route path="/tenantadmin/:tenantId/detail" element={<TenantDetail />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            const tenantNames = screen.getAllByText('Tenant One');
            expect(tenantNames).toHaveLength(2);
            expect(screen.getByText('Title One')).toBeVisible();
            expect(screen.getByText('Description One')).toBeVisible();
            expect(screen.getByText('Contact One')).toBeVisible();
            expect(screen.getByText('contactone@example.com')).toBeVisible();
            expect(screen.getByText('Photographer One')).toBeVisible();
            expect(screen.getByText('Logo Description One')).toBeVisible();
        });
    });

    test('Loading state is rendered initially', () => {
        jest.spyOn(tenantService, 'getTenant').mockReturnValue(new Promise(() => {})); // Mock unresolved promise

        render(
            <MemoryRouter initialEntries={['/tenantadmin/1/detail']}>
                <Routes>
                    <Route path="/tenantadmin/:tenantId/detail" element={<TenantDetail />} />
                </Routes>
            </MemoryRouter>,
        );

        const loadingTexts = screen.getAllByText('Loading...');
        expect(loadingTexts.length).toBeGreaterThan(0); // Adjust based on expected occurrences
    });
});
