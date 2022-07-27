import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SurveyListing from '../../../src/components/survey/listing';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';

test('render SurveyListing', async () => {

    setupEnv();
    render(
        <ProviderShell>
            <SurveyListing />
        </ProviderShell>,
    );

    await waitFor(() =>

        screen.getByTestId('SurveyListing/search-button'),
    );
    expect(screen.getByTestId('SurveyListing/search-button'));

    expect(screen.getByTestId('SurveyListing/search-button')).not.toBeDisabled();
});
