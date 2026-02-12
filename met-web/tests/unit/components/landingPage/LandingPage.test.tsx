import { render, waitFor, screen, fireEvent, within, getByRole } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import LandingComponent from 'components/landing/LandingComponent';
import { setupEnv } from '../setEnvVars';
import { LandingContext } from 'components/landing/LandingContext';
import { openEngagement, closedEngagement } from '../factory';
import { RouterProvider, createMemoryRouter } from 'react-router';

const MOCK_TENANT = {
    title: 'Mock Tenant',
    description: 'Mock Tenant Description',
};

jest.mock('axios');

jest.mock('components/common', () => ({
    ...jest.requireActual('components/common'),
    PrimaryButtonOld: ({ children, ...rest }: { children: React.ReactNode }) => {
        return <button {...rest}>{children}</button>;
    },
}));

jest.mock('hooks', () => ({
    useAppTranslation: () => ({
        t: (key: string) => key, // return the key itself
    }),
    useAppSelector: (callback: (state: unknown) => unknown) =>
        callback({
            tenant: MOCK_TENANT,
            user: {
                roles: [],
            },
        }),
}));

// mock enums to fix TS compiler issue when importing them
jest.mock('constants/engagementStatus', () => ({
    EngagementDisplayStatus: {
        Draft: 1,
        Published: 2,
        Closed: 3,
        Scheduled: 4,
        Upcoming: 5,
        Open: 6,
        Unpublished: 7,
        // Allow backwards lookup like the enum we're mocking
        1: 'Draft',
        2: 'Published',
        3: 'Closed',
        4: 'Scheduled',
        5: 'Upcoming',
        6: 'Open',
        7: 'Unpublished',
    },
    SubmissionStatus: {
        Upcoming: 1,
        Open: 2,
        Closed: 3,
        Unpublished: 4,
    },
    EngagementStatus: {
        Draft: 1,
        Published: 2,
        Closed: 3,
        Scheduled: 4,
        Unpublished: 5,
    },
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(() => jest.fn()),
}));

describe('Landing page tests', () => {
    beforeEach(() => {
        setupEnv();
    });

    test('LandingComponent is rendered correctly with engagements listed', async () => {
        render(
            <RouterProvider
                router={createMemoryRouter([
                    {
                        path: '/',
                        element: (
                            <LandingContext.Provider
                                value={{
                                    searchFilters: {
                                        name: '',
                                        status: [],
                                        metadata: [],
                                    },
                                    metadataFilters: [],
                                    clearFilters: jest.fn(),
                                    drawerOpened: false,
                                    setDrawerOpened: jest.fn(),
                                    setSearchFilters: jest.fn(),
                                    setPage: jest.fn(),
                                    page: 1,
                                    engagements: [openEngagement, closedEngagement],
                                    loadingEngagements: false,
                                    totalEngagements: 0,
                                }}
                            >
                                <LandingComponent />
                            </LandingContext.Provider>
                        ),
                    },
                ])}
            />,
        );

        await waitFor(() => {
            expect(screen.getByPlaceholderText('landing.filters.searchPlaceholder')).toBeInTheDocument();
            expect(screen.getByText('landing.filters.search')).toBeInTheDocument();
            expect(screen.getByText('landing.filters.drawer.openButton')).toBeInTheDocument();
            expect(
                screen.getByText((content, element) => {
                    return (
                        (element as HTMLElement).classList.contains('MuiSelect-select') &&
                        element?.textContent === 'landing.filters.status.all'
                    );
                }),
            ).toBeInTheDocument();
            expect(screen.getByText(MOCK_TENANT.title)).toBeInTheDocument();
            expect(screen.getByText(MOCK_TENANT.description)).toBeInTheDocument();
            expect(screen.getByText(openEngagement.name)).toBeInTheDocument();
            expect(screen.getByText(closedEngagement.name)).toBeInTheDocument();
        });
    });

    test('Search functionality is triggered on input change', async () => {
        const setSearchFiltersMock = jest.fn();

        render(
            <RouterProvider
                router={createMemoryRouter([
                    {
                        path: '/',
                        element: (
                            <LandingContext.Provider
                                value={{
                                    searchFilters: {
                                        name: '',
                                        status: [],
                                        metadata: [],
                                    },
                                    metadataFilters: [],
                                    clearFilters: jest.fn(),
                                    drawerOpened: false,
                                    setDrawerOpened: jest.fn(),
                                    setSearchFilters: setSearchFiltersMock,
                                    setPage: jest.fn(),
                                    page: 1,
                                    engagements: [openEngagement, closedEngagement],
                                    loadingEngagements: false,
                                    totalEngagements: 0,
                                }}
                            >
                                <LandingComponent />
                            </LandingContext.Provider>
                        ),
                    },
                ])}
            />,
        );

        const searchInput = screen.getByPlaceholderText('landing.filters.searchPlaceholder');
        fireEvent.change(searchInput, { target: { value: 'New Search' } });

        await waitFor(() => {
            expect(setSearchFiltersMock).toHaveBeenCalledTimes(1);
        });
    });

    test('Status dropdown is working', async () => {
        const setSearchFiltersMock = jest.fn();

        render(
            <RouterProvider
                router={createMemoryRouter([
                    {
                        path: '/',
                        element: (
                            <LandingContext.Provider
                                value={{
                                    searchFilters: {
                                        name: '',
                                        status: [],
                                        metadata: [],
                                    },
                                    metadataFilters: [],
                                    clearFilters: jest.fn(),
                                    drawerOpened: false,
                                    setDrawerOpened: jest.fn(),
                                    setSearchFilters: setSearchFiltersMock,
                                    setPage: jest.fn(),
                                    page: 1,
                                    engagements: [openEngagement, closedEngagement],
                                    loadingEngagements: false,
                                    totalEngagements: 0,
                                }}
                            >
                                <LandingComponent />
                            </LandingContext.Provider>
                        ),
                    },
                ])}
            />,
        );

        // Find all elements with role "combobox"
        const allComboboxes = screen.getAllByRole('combobox');

        // Find the specific combobox with id "status"
        const statusDropdown = allComboboxes.find((combobox) => combobox.id === 'status-filter') as HTMLElement;
        fireEvent.mouseDown(statusDropdown); // click event doesn't work for MUI Select
        // Wait for the dropdown to appear
        const listbox = within(getByRole(document.body, 'listbox'));
        const openOption = listbox.getByText('landing.filters.status.open');
        fireEvent.click(openOption);

        await waitFor(() => {
            expect(setSearchFiltersMock).toHaveBeenCalledWith({
                name: '',
                status: [6], // The numeric value corresponding to 'Open'
                metadata: [],
            });
        });
    });

    test('Filter drawer is opened and closed', async () => {
        const setDrawerOpenedMock = jest.fn();

        render(
            <RouterProvider
                router={createMemoryRouter([
                    {
                        path: '/',
                        element: (
                            <LandingContext.Provider
                                value={{
                                    searchFilters: {
                                        name: '',
                                        status: [],
                                        metadata: [],
                                    },
                                    metadataFilters: [],
                                    clearFilters: jest.fn(),
                                    drawerOpened: false,
                                    setDrawerOpened: setDrawerOpenedMock,
                                    setSearchFilters: jest.fn(),
                                    setPage: jest.fn(),
                                    page: 1,
                                    engagements: [],
                                    loadingEngagements: false,
                                    totalEngagements: 0,
                                }}
                            >
                                <LandingComponent />
                            </LandingContext.Provider>
                        ),
                    },
                ])}
            />,
        );

        const filterButton = screen.getByText('landing.filters.drawer.openButton');
        // Open the drawer...
        fireEvent.click(filterButton);

        await waitFor(() => {
            expect(setDrawerOpenedMock).toHaveBeenCalledWith(true);
        });

        const closeButton = screen.getByText('landing.filters.drawer.apply');
        // Close it again >:)
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(setDrawerOpenedMock).toHaveBeenCalledWith(false);
        });
    });

    test('NoResult component is rendered when engagements array is empty', async () => {
        const setDrawerOpenedMock = jest.fn();

        render(
            <RouterProvider
                router={createMemoryRouter([
                    {
                        path: '/',
                        element: (
                            <LandingContext.Provider
                                value={{
                                    searchFilters: {
                                        name: '',
                                        status: [],
                                        metadata: [],
                                    },
                                    metadataFilters: [],
                                    clearFilters: jest.fn(),
                                    drawerOpened: false,
                                    setDrawerOpened: setDrawerOpenedMock,
                                    setSearchFilters: jest.fn(),
                                    setPage: jest.fn(),
                                    page: 1,
                                    engagements: [],
                                    loadingEngagements: false,
                                    totalEngagements: 0,
                                }}
                            >
                                <LandingComponent />
                            </LandingContext.Provider>
                        ),
                    },
                ])}
            />,
        );

        expect(screen.getByTestId('NoResultsHeader')).toBeInTheDocument();
    });
});
