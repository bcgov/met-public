import React from 'react';
import '@testing-library/jest-dom';
import LandingPage from '../../../src/components/LandingPage/LandingPage';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';

test('Load Landing Page', async () => {

    setupEnv();
    render(
        <ProviderShell>
            <LandingPage />
        </ProviderShell>,
    );
    fireEvent.click(screen.getByTestId('create-engagement-button-landingPage'));

    await waitFor(() =>

        screen.getByTestId('create-engagement-button-landingPage'),
    );

    expect(screen.getByTestId('create-engagement-button-landingPage')).toHaveTextContent('+ Create An Engagement');

    expect(screen.getByTestId('create-engagement-button-landingPage')).not.toBeDisabled();
});
