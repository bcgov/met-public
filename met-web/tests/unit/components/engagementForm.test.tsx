import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../src/components/engagement/form/EngagementForm';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';

test('Load Engagement Form', async () => {

    setupEnv();
    render(
        <ProviderShell>
            <EngagementForm />
        </ProviderShell>,
    );

});
