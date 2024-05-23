import React, { ReactNode } from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as tenantService from 'services/tenantService';
import TenantCreationPage from 'components/tenantManagement/Create';
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

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => {
        return { tenantShortName: mockTenant.short_name };
    }),
    useNavigate: jest.fn(() => navigate),
}));

jest.mock('services/tenantService', () => ({
    getAllTenants: jest.fn(),
    createTenant: jest.fn(),
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

// Mocking BreadcrumbTrail component
jest.mock('components/common/Navigation/Breadcrumb', () => ({
    BreadcrumbTrail: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('Tenant Detail Page tests', () => {
    const dispatch = jest.fn();

    const editField = async (placeholder: string, value: string) => {
        const field = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
        field.focus();
        field.setSelectionRange(0, field.value.length);
        fireEvent.change(field, { target: { value } });
        fireEvent.blur(field); // Trigger validation
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(dispatch);
        jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigate);
        jest.spyOn(tenantService, 'getAllTenants').mockResolvedValue([mockTenant]);
        jest.spyOn(tenantService, 'createTenant').mockResolvedValue(mockTenant);
        render(<TenantCreationPage />);
    });

    test('Tenant creation page is rendered', async () => {
        await waitFor(() => {
            expect(screen.getByText('Create Tenant Instance')).toBeVisible();
            expect(screen.getByText('Tenant Details')).toBeVisible();
            expect(screen.getByText('* Required fields')).toBeVisible();
        });

        // The page should be fetching the tenant data to validate the short name
        expect(tenantService.getAllTenants).toHaveBeenCalledTimes(1);

        // Check that the form isn't pre-filled
        await waitFor(() => {
            const fields = screen.getAllByRole('textbox');
            expect(fields).toHaveLength(8);
            expect(screen.getByPlaceholderText('Name')).toContainValue('');
            expect(screen.getByPlaceholderText('Full Name')).toContainValue('');
            expect(screen.getByPlaceholderText('Email')).toContainValue('');
            expect(screen.getByPlaceholderText('shortname')).toContainValue('');
            expect(screen.getByPlaceholderText('Title')).toContainValue('');
            expect(screen.getByPlaceholderText('Description')).toContainValue('');
            expect(screen.getByText('Drag and drop your image here.')).toBeVisible();
            expect(screen.getByTestId('tenant-form/image-credit')).toContainValue('');
            expect(screen.getByTestId('tenant-form/image-description')).toContainValue('');
        });

        // Check that the buttons are visible
        expect(screen.getByText('Create Instance')).toBeVisible();
        // Button should be disabled until form is completed
        expect(screen.getByText('Create Instance')).toBeDisabled();
        expect(screen.getByText('Cancel')).toBeVisible();
    });

    test('Button is enabled after form is filled', async () => {
        await waitFor(() => {
            editField('Name', 'New Name');
            editField('Full Name', 'New Full Name');
            editField('Email', 'contactone@example.com');
            editField('shortname', 'newname');
            editField('Title', 'New Title');
            editField('Description', 'New Description');
            expect(screen.getByText('Create Instance')).toBeEnabled();
        });
    });

    test('Email throws error if invalid', async () => {
        await waitFor(() => {
            editField('Email', 'invalid-email');
            expect(screen.getByText("That doesn't look like a valid email...")).toBeVisible();
            expect(screen.getByText('Create Instance')).toBeDisabled();
        });
    });

    test('Short name throws error if invalid', async () => {
        await waitFor(() => {
            editField('shortname', 'invalid shortname');
            expect(screen.getByText('Your input contains invalid symbols')).toBeVisible();
            expect(screen.getByText('Create Instance')).toBeDisabled();
        });
    });

    test('Character limit is enforced on fields', async () => {
        await waitFor(() => {
            editField('Title', 'a'.repeat(256));
            expect(screen.getByText('This input is too long!')).toBeVisible();
            expect(screen.getByText('Create Instance')).toBeDisabled();
        });
    });

    test('Unique short name is enforced', async () => {
        await waitFor(() => {
            editField('shortname', mockTenant.short_name);
            expect(screen.getByText('This short name is already in use')).toBeVisible();
            expect(screen.getByText('Create Instance')).toBeDisabled();
        });
    });

    test('Cancel button navigates back to tenant listing page', async () => {
        await waitFor(() => {
            fireEvent.click(screen.getByText('Cancel'));
            expect(navigate).toHaveBeenCalledTimes(1);
            expect(navigate).toHaveBeenCalledWith(`../tenantadmin`);
        });
    });

    test('User is prompted for confirmation when navigating with unsaved changes', async () => {
        await waitFor(() => {
            editField('Name', 'New Name');
            fireEvent.click(screen.getByText('Cancel'));
        });
        await waitFor(() => {
            expect(capturedNotification).toBeDefined();
            expect(capturedNotification.data.header).toBe('Unsaved Changes');
            expect(capturedNotification.data.handleConfirm).toBeDefined();
        });
        capturedNotification.data.handleConfirm();
        expect(navigate).toHaveBeenCalledTimes(1);
    });

    test('Create instance button calls createTenant action', async () => {
        await waitFor(() => {
            editField('Name', 'New Name');
            editField('Full Name', 'New Full Name');
            editField('Email', 'contactone@example.com');
            editField('shortname', 'newname');
            editField('Title', 'New Title');
            editField('Description', 'New Description');
            expect(screen.getByText('Create Instance')).toBeEnabled();
            fireEvent.click(screen.getByText('Create Instance'));
            const updatedTenant = {
                name: 'New Name',
                title: 'New Title',
                description: 'New Description',
                contact_name: 'New Full Name',
                contact_email: 'contactone@example.com',
                short_name: 'newname',
                logo_url: '',
                logo_credit: '',
                logo_description: '',
            };
            expect(tenantService.createTenant).toHaveBeenCalledWith(updatedTenant);
        });
    });
});
