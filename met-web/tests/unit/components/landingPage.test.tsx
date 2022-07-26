import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom';
import LandingPage from '../../../src/components/LandingPage/LandingPage';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';

test('Load Landing Page', async () => {
    // Arrange
    // Act
    // Assert
    setupEnv();
    render(
        <ProviderShell>
            <LandingPage />
        </ProviderShell>,
    );
    fireEvent.click(screen.getByTestId('create-engagement-button-landingPage'));
    // wait until the `get` request promise resolves and
    // the component calls setState and re-renders.
    // `waitFor` waits until the callback doesn't throw an error

    await waitFor(() =>
        // getByRole throws an error if it cannot find an element
        screen.getByTestId('create-engagement-button-landingPage'),
    );
    // assert that the alert message is correct using
    // toHaveTextContent, a custom matcher from jest-dom.
    expect(screen.getByTestId('create-engagement-button-landingPage')).toHaveTextContent('Logout');

    // assert that the button is not disabled using
    // toBeDisabled, a custom matcher from jest-dom.
    expect(screen.getByTestId('create-engagement-button-landingPage')).not.toBeDisabled();
});
