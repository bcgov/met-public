import React, { ReactNode } from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as tenantService from 'services/tenantService';
import TenantListingPage from '../../../../src/components/tenantManagement/Listing';
import { USER_ROLES } from 'services/userService/constants';
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom';

const mockTenantOne = {
    id: 1,
    name: 'Tenant One',
    title: 'Title One',
    description: 'Description One',
    contact_name: 'Contact One',
    short_name: 'tenantone',
};

const mockTenantTwo = {
    id: 2,
    name: 'Tenant Two',
    title: 'Title Two',
    description: 'Description Two',
    contact_name: 'Contact Two',
    short_name: 'tenanttwo',
};

jest.mock('axios');

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Link: ({ children }: { children: ReactNode }) => {
        return <a>{children}</a>;
    },
}));

jest.mock('components/common', () => ({
    ...jest.requireActual('components/common'),
    PrimaryButtonOld: ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
        return <button onClick={onClick}>{children}</button>;
    },
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => {
        return {
            roles: [USER_ROLES.SUPER_ADMIN],
        };
    }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn(() => ({
        search: '',
    })),
    useRouteLoaderData: jest.fn(() => ({
        tenants: [mockTenantOne, mockTenantTwo],
    })),
}));

describe('Tenant Listing Page tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    jest.spyOn(tenantService, 'getAllTenants').mockReturnValue(Promise.resolve([mockTenantOne, mockTenantTwo]));

    beforeEach(() => {
        setupEnv();
    });

    test('Tenant table is rendered', async () => {
        const router = createMemoryRouter(
            [
                {
                    path: '/tenantadmin/:tenantId/detail',
                    element: <TenantListingPage />,
                    id: 'tenant',
                },
            ],
            { initialEntries: ['/tenantadmin/1/detail'] },
        );
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getByText('Tenant One')).toBeVisible();
            expect(screen.getByText('Tenant Two')).toBeVisible();
            expect(screen.getByText('Description One')).toBeVisible();
            expect(screen.getByText('Description Two')).toBeVisible();

            expect(screen.getByText('Add Tenant')).toBeVisible();
        });
    });
});
