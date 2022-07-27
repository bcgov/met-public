import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../src/components/engagement/form/EngagementForm';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';

test('Load Engagement Form', async () => {
    // Arrange
    // Act
    // Assert
    setupEnv();
    render(
        <ProviderShell>
            <EngagementForm />
        </ProviderShell>,
    );

    // fireEvent.click(screen.getByTestId('engagement-form/preview-engagement-button'));

    // wait until the `get` request promise resolves and
    // the component calls setState and re-renders.
    // `waitFor` waits until the callback doesn't throw an error

    // await waitFor(() =>
    // getByRole throws an error if it cannot find an element
    //     screen.getByTestId('engagement-form/preview-engagement-button'),
    // );
    // assert that the alert message is correct using
    // toHaveTextContent, a custom matcher from jest-dom.
    // expect(screen.getByTestId('engagement-form/preview-engagement-button')).toHaveTextContent('Logout');

    // assert that the button is not disabled using
    // toBeDisabled, a custom matcher from jest-dom.
    // expect(screen.getByTestId('engagement-form/preview-engagement-button')).not.toBeDisabled();
});
