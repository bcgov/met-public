import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { Notification } from '../../../src/components/common/notification';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';

test('render notification', async () => {
    // Arrange
    // Act
    // Assert
    setupEnv();
    render(
        <ProviderShell>
            <Notification />
        </ProviderShell>,
    );

    // wait until the `get` request promise resolves and
    // the component calls setState and re-renders.
    // `waitFor` waits until the callback doesn't throw an error

    await waitFor(() =>
        // getByRole throws an error if it cannot find an element

        screen.getByTestId('snackbar-notification'),
    );
    // assert that the alert message is correct using
    // toHaveTextContent, a custom matcher from jest-dom.
    expect(screen.getByTestId('snackbar-notification'));

    // assert that the button is not disabled using
    // toBeDisabled, a custom matcher from jest-dom.
    expect(screen.getByTestId('snackbar-notification')).not.toBeDisabled();
});
