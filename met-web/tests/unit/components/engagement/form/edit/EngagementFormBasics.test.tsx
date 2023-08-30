
import { render, waitFor, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../../../src/components/engagement/form';
import assert from 'assert';

// Import other necessary libraries and mock setups

describe('Engagement form basic tests', () => {
    // Your setup code here

    test('Engagement form with saved engagement should display saved info', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(getEngagementMock).toHaveBeenCalledOnce();
        expect(getEngagementMetadataMock).toHaveBeenCalledOnce();
        expect(screen.getByTestId('update-engagement-button')).toBeVisible();
        expect(screen.getByDisplayValue('2022-09-01')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2022-09-30')).toBeInTheDocument();
        expect(screen.getByText('Survey 1')).toBeInTheDocument();
    });

    test('Save engagement button should trigger patch call', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });
        const updateButton = screen.getByTestId('update-engagement-button');

        const nameInput = container.querySelector('input[name="name"]');
        assert(nameInput, 'Unable to find engagement name input');
        fireEvent.change(nameInput, { target: { value: 'Survey 1 Updated' } });
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(patchEngagementMock).toHaveBeenCalledOnce();
        });
    });

    test('Modal with warning appears when removing survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const removeSurveyButton = screen.getByTestId(`survey-widget/remove-${survey.id}`);

        fireEvent.click(removeSurveyButton);

        expect(openNotificationModalMock).toHaveBeenCalledOnce();
    });

});