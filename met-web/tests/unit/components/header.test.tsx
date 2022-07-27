import React from 'react';
import '@testing-library/jest-dom';
import LoggedInHeader from '../../../src/components/layout/Header/LoggedInHeader';
import { render, waitFor, screen } from '@testing-library/react';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';

test('Load Header', async () => {

    setupEnv();
    render(
        <ProviderShell>
            <LoggedInHeader />
        </ProviderShell>,
    );



    await waitFor(() =>

        screen.getByTestId('button-header'),
    );

    expect(screen.getByTestId('button-header')).toHaveTextContent('Logout');


    expect(screen.getByTestId('button-header')).not.toBeDisabled();
});
