import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SideNav from '../../../src/components/layout/SideNav/SideNav';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';
import { Routes } from '../../../src/components/layout/SideNav/SideNavElements';

const drawerWidth = 240;

test('Load SideNav', async () => {
    // Arrange
    // Act
    // Assert
    setupEnv();
    render(
        <ProviderShell>
            <SideNav isMediumScreen={false} open={true} drawerWidth={drawerWidth} />
        </ProviderShell>,
    );

    Routes.forEach((route, index) => {
        fireEvent.click(screen.getByTestId(`SideNav/${route.name}-button`));
    }),
        // wait until the `get` request promise resolves and
        // the component calls setState and re-renders.
        // `waitFor` waits until the callback doesn't throw an error

        await waitFor(() =>
            // getByRole throws an error if it cannot find an element
            Routes.forEach((route, index) => {
                screen.getByTestId(`SideNav/${route.name}-button`);
            }),
        );
    // assert that the alert message is correct using
    // toHaveTextContent, a custom matcher from jest-dom.
    Routes.forEach((route, index) => {
        expect(screen.getByTestId(`SideNav/${route.name}-button`)).toHaveTextContent(`${route.name}`);
    });

    // assert that the button is not disabled using
    // toBeDisabled, a custom matcher from jest-dom.
    Routes.forEach((route, index) => {
        expect(screen.getByTestId(`SideNav/${route.name}-button`)).not.toBeDisabled();
    });
});
