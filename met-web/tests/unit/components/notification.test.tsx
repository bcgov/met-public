import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { Notification } from '../../../src/components/common/notification';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';

test('render notification', async () => {
    setupEnv();
    render(
        <ProviderShell>
            <Notification />
        </ProviderShell>,
    );
});
