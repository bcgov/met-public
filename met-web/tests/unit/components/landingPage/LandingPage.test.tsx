import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import LandingComponent from 'components/landing/LandingComponent';
import { setupEnv } from '../setEnvVars';
import { LandingContext } from 'components/landing/LandingContext';
import * as reactRedux from 'react-redux';
import { openEngagement, closedEngagement } from '../factory';
import userEvent from '@testing-library/user-event';

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

jest.mock('constants/engagementStatus', () => ({
    EngagementDisplayStatus: {
        Draft: 1,
        Published: 2,
        Closed: 3,
        Scheduled: 4,
        Upcoming: 5,
        Open: 6,
        Unpublished: 7,
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
                    },
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
            expect(screen.getByPlaceholderText('landingPage.placeholder')).toBeInTheDocument();
            expect(screen.getByText('landingPage.engagementNameLabel')).toBeInTheDocument();
            expect(screen.getByText('landingPage.statusLabel')).toBeInTheDocument();
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
                    },
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

        const searchInput = screen.getByPlaceholderText('landingPage.placeholder');
        fireEvent.change(searchInput, { target: { value: 'New Search' } });

        await waitFor(() => {
            expect(setSearchFiltersMock).toHaveBeenCalledTimes(1);
        });
    });

    test('Status filter is working', async () => {
        const setSearchFiltersMock = jest.fn();

        render(
            <LandingContext.Provider
                value={{
                    searchFilters: {
                        name: '',
                        status: [],
                    },
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
        const statusDropdown = allButtons.find((button) => button.id === 'status') as HTMLElement;
        userEvent.click(statusDropdown);
        const openItem = await screen.findByText('landingPage.status.open');
        userEvent.click(openItem);

        await waitFor(() => {
            expect(setSearchFiltersMock).toHaveBeenCalledWith({
                name: '',
                status: [6], // The numeric value corresponding to 'Open'
            });
        });
    });
});
