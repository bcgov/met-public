import React, { JSX, ReactNode, SuspenseProps } from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactRouter from 'react-router';
import * as tenantService from 'services/tenantService';
import TenantEditPage from 'components/tenantManagement/Edit';
import { USER_ROLES } from 'services/userService/constants';

const navigate = jest.fn();
const revalidate = jest.fn();

const mockTenant = {
    id: 1,
    name: 'Tenant One',
    title: 'Title One',
    description: 'Description One',
    contact_name: 'Contact One',
    short_name: 'tenantone',
    contact_email: 'contactone@example.com',
    hero_image_url: 'https://example.com/logo.png',
    hero_image_credit: 'Photographer One',
    hero_image_description: 'Logo Description One',
};

global['Request'] = jest.fn().mockImplementation((input: string = '', init: RequestInit = {}) => ({
    // React Router data APIs call toUpperCase on request.method; default to GET
    method: (init.method || 'GET').toUpperCase(),
    url: input,
    headers: {
        get: jest.fn(),
        has: jest.fn(),
    },
    signal: {
        removeEventListener: jest.fn(),
        addEventListener: jest.fn(),
    },
    clone: jest.fn(),
}));

jest.mock('react', () => ({
    //this makes the suspense component render its children immediately
    ...jest.requireActual('react'),
    Suspense: jest.fn(({ children, fallback }: { children: ReactNode; fallback: ReactNode }) => {
        return children;
    }),
}));

jest.mock('react-router', () => {
    const actual = jest.requireActual('react-router');
    const useRouteLoaderDataMock = jest.fn((id: string) => {
        if (id === 'tenant') {
            return mockTenant;
        }
        if (id === 'tenant-admin') {
            return [mockTenant];
        }
        return actual.useRouteLoaderData(id);
    });
    return {
        ...actual,
        useParams: jest.fn(() => {
            return { tenantShortName: mockTenant.short_name };
        }),
        useNavigate: jest.fn(() => navigate),
        useRevalidator: jest.fn(() => ({
            revalidate,
        })),
        useRouteLoaderData: useRouteLoaderDataMock,
        Await: ({ resolve, children }: { resolve: unknown; children: (value: unknown) => JSX.Element }) => (
            <>{children(resolve)}</>
        ),
        __esModule: true,
        __useRouteLoaderDataMock: useRouteLoaderDataMock,
    };
});

const useRouteLoaderDataMock = jest.requireMock('react-router').__useRouteLoaderDataMock as jest.Mock;

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
    useSelector: jest.fn((callback) =>
        callback({
            tenant: 'test',
            roles: [USER_ROLES.SUPER_ADMIN],
        }),
    ),
    useDispatch: jest.fn(() => jest.fn()),
}));

jest.mock('services/tenantService', () => ({
    updateTenant: jest.fn(),
}));

jest.mock('services/notificationService/notificationSlice', () => ({
    openNotification: jest.fn(),
}));

jest.mock('services/notificationModalService/notificationModalSlice', () => ({
    openNotificationModal: jest.fn(),
}));

// Mocking AutoBreadcrumbs component
jest.mock('components/common/Navigation/Breadcrumb', () => ({
    AutoBreadcrumbs: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('components/common/Navigation/UnsavedWorkConfirmation', () => ({
    __esModule: true,
    default: () => null,
}));

const renderPage = () => render(<TenantEditPage />);

describe('Tenant Editing Page tests', () => {
    const editField = (placeholder: string, value: string) => {
        const field = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
        field.focus();
        field.setSelectionRange(0, field.value.length);
        fireEvent.change(field, { target: { value } });
        fireEvent.blur(field); // Trigger validation
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigate);
    });

    test('Tenant edit page is rendered', async () => {
        renderPage();
        await waitFor(() => {
            expect(screen.getByText('Edit Tenant Instance')).toBeVisible();
            expect(screen.getByText('Tenant Details')).toBeVisible();
            expect(screen.getByText('* Required fields')).toBeVisible();
        });

        // The data should already be fetched if the header is displayed
        expect(useRouteLoaderDataMock).toHaveBeenCalledWith('tenant');

        // Check that the form is populated with the correct data
        await waitFor(() => {
            const fields = screen.getAllByRole('textbox');
            expect(fields).toHaveLength(8);
            expect(screen.getByPlaceholderText('Name')).toContainValue('Tenant One');
            expect(screen.getByPlaceholderText('Full Name')).toContainValue('Contact One');
            expect(screen.getByPlaceholderText('Email')).toContainValue('contactone@example.com');
            expect(screen.getByPlaceholderText('shortname')).toContainValue('tenantone');
            expect(screen.getByPlaceholderText('Title')).toContainValue('Title One');
            expect(screen.getByPlaceholderText('Description')).toContainValue('Description One');
            expect(screen.getByTestId('uploaded-image')).toHaveAttribute('src', 'https://example.com/logo.png');
            expect(screen.getByTestId('tenant-form/image-credit')).toContainValue('Photographer One');
            expect(screen.getByTestId('tenant-form/image-description')).toContainValue('Logo Description One');
        });

        // Check that the buttons are visible
        expect(screen.getByText('Update')).toBeVisible();
        expect(screen.getByText('Update')).toBeDisabled(); // Button should be disabled until form is edited
        expect(screen.getByText('Cancel')).toBeVisible();
    });

    test('Button is enabled after form is edited', async () => {
        renderPage();
        await waitFor(() => {
            editField('Name', 'New Name');
            expect(screen.getByText('Update')).not.toBeDisabled();
        });
    });

    test('Email throws error if invalid', async () => {
        renderPage();
        await waitFor(() => {
            editField('Email', 'invalid-email');
            expect(screen.getByText("That doesn't look like a valid email...")).toBeVisible();
            expect(screen.getByText('Update')).toBeDisabled();
        });
    });

    test('Short name throws error if invalid', async () => {
        renderPage();
        await waitFor(() => {
            editField('shortname', 'invalid shortname');
            expect(screen.getByText('Your input contains invalid symbols')).toBeVisible();
            expect(screen.getByText('Update')).toBeDisabled();
        });
    });

    test('Character limit is enforced on fields', async () => {
        renderPage();
        editField('Title', 'a'.repeat(256));
        await waitFor(() => {
            expect(screen.getByText('This input is too long!')).toBeVisible();
            expect(screen.getByText('Update')).toBeDisabled();
        });
    });

    test('Cancel button navigates back to tenant details page', async () => {
        renderPage();
        fireEvent.click(screen.getByText('Cancel'));
        await waitFor(() => {
            expect(navigate).toHaveBeenCalledTimes(1);
            expect(navigate).toHaveBeenCalledWith(`/tenantadmin/${mockTenant.short_name}/detail`);
        });
    });

    test('Update button calls updateTenant action', async () => {
        renderPage();
        await waitFor(() => {
            editField('Name', 'New Name');
            expect(screen.getByText('Update')).not.toBeDisabled();
        });
        fireEvent.click(screen.getByText('Update'));
        await waitFor(() => {
            expect(tenantService.updateTenant).toHaveBeenCalledTimes(1);
        });
        const updatedTenant = {
            ...mockTenant,
            name: 'New Name',
        };
        expect(tenantService.updateTenant).toHaveBeenCalledWith(updatedTenant, mockTenant.short_name);
    });

    test('Loader is displayed while fetching tenant data', async () => {
        jest.spyOn(React, 'Suspense').mockImplementation((props: SuspenseProps) => {
            return props.fallback as JSX.Element;
        });
        renderPage();
        await waitFor(() => {
            expect(screen.getByTestId('loader')).toBeVisible();
            expect(useRouteLoaderDataMock).toHaveBeenCalledWith('tenant');
        });
    });
});
