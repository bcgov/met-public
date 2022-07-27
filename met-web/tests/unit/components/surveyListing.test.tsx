import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SurveyListing from '../../../src/components/survey/listing';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';

test('render SurveyListing', async () => {
    // Arrange
    // Act
    // Assert
    setupEnv();
    render(
        <ProviderShell>
            <SurveyListing />
        </ProviderShell>,
    );

    // wait until the `get` request promise resolves and
    // the component calls setState and re-renders.
    // `waitFor` waits until the callback doesn't throw an error

    await waitFor(() =>
        // getByRole throws an error if it cannot find an element

        screen.getByTestId('SurveyListing/search-button'),
    );
    // assert that the alert message is correct using
    // toHaveTextContent, a custom matcher from jest-dom.
    expect(screen.getByTestId('SurveyListing/search-button'));

    // assert that the button is not disabled using
    // toBeDisabled, a custom matcher from jest-dom.
    expect(screen.getByTestId('SurveyListing/search-button')).not.toBeDisabled();
});
