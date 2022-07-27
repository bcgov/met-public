import React from 'react';
import '@testing-library/jest-dom';
import Engagement from '../../../src/components/engagement/view';
import { render } from '@testing-library/react';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';

test('Load Engagement', async () => {

    setupEnv();
    render(
        <ProviderShell>
            <Engagement />
        </ProviderShell>,
    );

});
