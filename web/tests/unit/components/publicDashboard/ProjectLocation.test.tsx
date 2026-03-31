import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectLocation from 'components/publicDashboard/KPI/ProjectLocation';
import * as mapService from 'services/analytics/mapService';
import { closedEngagement } from '../factory';

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useMediaQuery: jest.fn(() => true),
}));

jest.mock('hooks', () => ({
    useAppTranslation: () => ({
        t: (key: string) => {
            if (key === 'dashboard.errorBox.header') {
                return 'Error';
            }
            if (key === 'dashboard.errorBox.body') {
                return 'An error occurred while fetching data. Click to retry.';
            }
            return key; // Return key as translation fallback
        },
    }),
}));

jest.mock('components/map', () => () => <div>Mocked Map Component</div>);

const mockEngagement = closedEngagement;

const getMapDataMock = jest.spyOn(mapService, 'getMapData');

describe('ProjectLocation Component Tests', () => {
    const mockHandleProjectMapData = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('displays loading indicator while fetching data', () => {
        getMapDataMock.mockReturnValue(new Promise(() => { }));
        render(
            <ProjectLocation
                engagement={mockEngagement}
                engagementIsLoading={true}
                handleProjectMapData={mockHandleProjectMapData}
            />,
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('renders map correctly on successful data fetch', async () => {

        const geoJson = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {
                        name: 'Example Point',
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [-123.3656, 48.4284],
                    },
                },
            ],
        };

        const mockData = {
            latitude: 123,
            longitude: 456,
            geojson: JSON.stringify(geoJson),
            marker_label: 'Test Location',
        };
        getMapDataMock.mockResolvedValue(mockData);
        render(
            <ProjectLocation
                engagement={mockEngagement}
                engagementIsLoading={false}
                handleProjectMapData={mockHandleProjectMapData}
            />,
        );
        await waitFor(() => {
            expect(screen.getByText('Mocked Map Component')).toBeInTheDocument();
        });
    });

    test('displays error message on fetch failure', async () => {
        getMapDataMock.mockRejectedValue(new Error('Fetch Error'));
        render(
            <ProjectLocation
                engagement={mockEngagement}
                engagementIsLoading={false}
                handleProjectMapData={mockHandleProjectMapData}
            />,
        );
        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText('An error occurred while fetching data. Click to retry.')).toBeInTheDocument();
        });
    });
});
