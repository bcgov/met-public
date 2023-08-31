import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { setupCommonMocks } from './jestTestUtils';
import * as widgetService from 'services/widgetService';
import EngagementForm from 'components/engagement/form/EngagementFormTabs/EngagementForm'; // Update this import path
import { draftEngagement, engagementMetadata, surveys } from '../../../factory'; // Update these import paths

describe('Engagement form widget tests', () => {
    let useParamsMock: jest.SpyInstance;
    let getEngagementMock: jest.SpyInstance;
    let getEngagementMetadataMock: jest.SpyInstance;
    let getWidgetsMock: jest.SpyInstance;

    beforeAll(() => {
        const mocks = setupCommonMocks();
        useParamsMock = mocks.useParamsMock;
        getEngagementMock = mocks.getEngagementMock;
        getEngagementMetadataMock = mocks.getEngagementMetadataMock;
        Object.defineProperty(window, 'URL', {
            value: {
                createObjectURL: jest.fn(),
            },
        });
    });

    beforeEach(() => {
        getWidgetsMock = jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([]));
    });
    test('Cannot add more than one survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        getEngagementMetadataMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagementMetadata,
            }),
        );
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(screen.getByText('Add Survey')).toBeDisabled();
    });
});
