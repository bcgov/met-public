import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { Notification } from '../../../src/components/common/notification';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));
test('render notification', async () => {
    setupEnv();
    render(
        <ProviderShell>
            <Notification />
        </ProviderShell>,
    );
});
