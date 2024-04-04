import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Dashboard from 'components/publicDashboard/Dashboard';
import { setupEnv } from '../setEnvVars';
import { DashboardContext } from 'components/publicDashboard/DashboardContext';
import * as reactRedux from 'react-redux';
import { closedEngagement } from '../factory';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');
jest.mock('components/common', () => ({
    ...jest.requireActual('components/common'),
    PrimaryButton: ({ children, ...rest }: { children: React.ReactNode }) => {
        return <button {...rest}>{children}</button>;
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ search: '' })),
    useParams: jest.fn(() => {
        return { slug: '' };
    }),
    useNavigate: () => jest.fn(),
}));

jest.mock('hooks', () => {
    const translations: Record<string, string> = {
        'dashboard.surveyEmailsSent': 'Survey Emails Sent',
        'dashboard.surveysCompleted': 'Surveys Completed',
        'dashboard.projectLocation': 'Project Location',
        'dashboard.submissionTrend.label': 'Live Activity - Engagement',
        'dashboard.link.0': '<<Return to ',
        'dashboard.link.1': ' Engagement'
    };

    return {
        useAppTranslation: () => ({
            t: (key: string) => translations[key] || key,
        }),
        useAppSelector: jest.fn(() => true), // mock useAppSelector here if needed
    };
});

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useMediaQuery: jest.fn(() => true),
}));

jest.mock('maplibre-gl/dist/maplibre-gl', () => ({
    Map: () => ({}),
}));

describe('Public Dashboard page tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    beforeEach(() => {
        setupEnv();
        render(
            <BrowserRouter>
                <DashboardContext.Provider
                    value={{
                        engagement: closedEngagement,
                        isEngagementLoading: false,
                        dashboardType: 'public',
                    }}
                >
                    <Dashboard />
                </DashboardContext.Provider>
            </BrowserRouter>,
        );
    });

    test('Public Dashboard is rendered correctly', async () => {
        await waitFor(() => {
            const elements = screen.getAllByText(closedEngagement.name);
            expect(elements.length).toBeGreaterThan(1);
        });
    });

    test('Navigation links work correctly', async () => {
        const returnLink = screen.getByText(`<<Return to ${closedEngagement.name} Engagement`);
        expect(returnLink).toBeInTheDocument();
        userEvent.click(returnLink);
        expect(window.location.pathname).toBe(`/engagements/${closedEngagement.id}/view`);
    });

    test('Public Dashboard has sub components', async () => {
        expect(screen.getByText(/Survey Emails Sent/i)).toBeInTheDocument();
        expect(screen.getByText(/Surveys Completed/i)).toBeInTheDocument();
        expect(screen.getByText(/Project Location/i)).toBeInTheDocument();
        expect(screen.getByText(/Live Activity - Engagement/i)).toBeInTheDocument();
    });
});
