import { render, waitFor, screen, fireEvent, within, getByRole } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import LandingComponent from 'components/landing/LandingComponent';
import { setupEnv } from '../setEnvVars';
import { LandingContext } from 'components/landing/LandingContext';
import * as reactRedux from 'react-redux';
import { openEngagement, closedEngagement } from '../factory';

jest.mock('axios');

jest.mock('components/common', () => ({
    ...jest.requireActual('components/common'),
    PrimaryButton: ({ children, ...rest }: { children: React.ReactNode }) => {
        return <button {...rest}>{children}</button>;
    },
}));

jest.mock('hooks', () => ({
    useAppTranslation: () => ({
        t: (key: string) => key, // return the key itself
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

describe('Landing page tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());

    beforeEach(() => {
        setupEnv();
    });

    test('LandingComponent is rendered correctly with engagements listed', async () => {
        render(
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
            </LandingContext.Provider>,
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
            expect(screen.getByText('landing.banner.header')).toBeInTheDocument();
            expect(screen.getByText('landing.banner.description')).toBeInTheDocument();
            expect(screen.getByText(openEngagement.name)).toBeInTheDocument();
            expect(screen.getByText(closedEngagement.name)).toBeInTheDocument();
        });
    });

    test('Search functionality is triggered on input change', async () => {
        const setSearchFiltersMock = jest.fn();

        render(
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
                    engagements: [],
                    loadingEngagements: false,
                    totalEngagements: 0,
                }}
            >
                <LandingComponent />
            </LandingContext.Provider>,
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
                    engagements: [],
                    loadingEngagements: false,
                    totalEngagements: 0,
                }}
            >
                <LandingComponent />
            </LandingContext.Provider>,
        );

        // Find all elements with role "button"
        const allButtons = screen.getAllByRole('button');

        // Find the specific button with id "status"
        const statusDropdown = allButtons.find((button) => button.id === 'status-filter') as HTMLElement;
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
            </LandingContext.Provider>,
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
});
