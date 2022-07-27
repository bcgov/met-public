import React from 'react';
import '@testing-library/jest-dom';
import Engagement from '../../../src/components/engagement/view';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';

test('Load Engagement', async () => {
    // Arrange
    // Act
    // Assert
    setupEnv();
    render(
        <ProviderShell>
            <Engagement />
        </ProviderShell>,
    );

    // fireEvent.click(screen.getByTestId('EngagementBanner/share-your-thoughts-button'));

    // wait until the `get` request promise resolves and
    // the component calls setState and re-renders.
    // `waitFor` waits until the callback doesn't throw an error

    // await waitFor(() =>
    // getByRole throws an error if it cannot find an element
    // screen.getByTestId('EngagementBanner/share-your-thoughts-button'),
    // );
    // assert that the alert message is correct using
    // toHaveTextContent, a custom matcher from jest-dom.
    // expect(screen.getByTestId('EngagementBanner/share-your-thoughts-button')).toHaveTextContent('Logout');

    // assert that the button is not disabled using
    // toBeDisabled, a custom matcher from jest-dom.
    // expect(screen.getByTestId('EngagementBanner/share-your-thoughts-button')).not.toBeDisabled();
});
