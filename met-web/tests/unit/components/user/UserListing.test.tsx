import React, { ReactNode } from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as userService from 'services/userService/api';
import { User, createDefaultUser } from 'models/user';
import UserManagementListing from 'components/userManagement/listing';

const mockUser1: User = {
    ...createDefaultUser,
    id: 1,
    contact_number: '555 012 4564',
    description: 'mock description',
    email_id: '1',
    external_id: '3859G58GJH3921',
    first_name: 'Mock first name',
    last_name: 'Mock last name',
    updated_date: Date(),
    created_date: Date(),
    status: 'Active',
    access_type: 'Staff',
    roles: [],
};

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Link: ({ children }: { children: ReactNode }) => {
        return <a>{children}</a>;
    },
}));

jest.mock('components/common', () => ({
    ...jest.requireActual('components/common'),
    PrimaryButton: ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
        return <button onClick={onClick}>{children}</button>;
    },
}));

describe('User Management tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    jest.spyOn(userService, 'getUserList').mockReturnValue(
        Promise.resolve({
            items: [mockUser1],
            total: 1,
        }),
    );

    beforeEach(() => {
        setupEnv();
    });

    test('User table is rendered', async () => {
        render(<UserManagementListing />);

        await waitFor(() => {
            expect(screen.getByText('User Name')).toBeVisible();
            expect(screen.getByText('Role')).toBeVisible();
            expect(screen.getByText('Date Added')).toBeVisible();
            expect(screen.getByText('Status')).toBeVisible();
        });
    });

    test('Add user to group modal appears', async () => {
        render(<UserManagementListing />);

        await waitFor(() => {
            expect(screen.getByText('User Name')).toBeVisible();
        });

        const exportButton = screen.getByText('+ Add User');
        fireEvent.click(exportButton);

        await waitFor(() => {
            expect(screen.getByText('Add a User')).toBeVisible();
            expect(screen.getByText('Select the user you want to add')).toBeVisible();
            expect(screen.getByText('What role would you like to assign to this user?')).toBeVisible();
        });
    });
});
