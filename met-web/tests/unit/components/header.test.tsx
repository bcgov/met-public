import React from 'react';
import '@testing-library/jest-dom';
import LoggedInHeader from '../../../src/components/layout/Header/InternalHeader';
import { render, waitFor, screen } from '@testing-library/react';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';
import { tenant } from './factory';

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));

test('Load Header', async () => {
    setupEnv();
    render(
        <ProviderShell>
            <LoggedInHeader tenant={tenant} />
        </ProviderShell>,
    );

    await waitFor(() => screen.getByTestId('button-header'));

    expect(screen.getByTestId('button-header')).toHaveTextContent('Logout');

    expect(screen.getByTestId('button-header')).not.toBeDisabled();
});
