import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SideNav from '../../../src/components/layout/SideNav/SideNav';
import ProviderShell from './ProviderShell';
import { setupEnv } from './setEnvVars';
import { Routes } from '../../../src/components/layout/SideNav/SideNavElements';

const drawerWidth = 240;

test('Load SideNav', async () => {

    setupEnv();
    render(
        <ProviderShell>
            <SideNav isMediumScreen={false} open={true} drawerWidth={drawerWidth} />
        </ProviderShell>,
    );

    Routes.forEach((route) => {
        fireEvent.click(screen.getByTestId(`SideNav/${route.name}-button`));
    });
    
        await waitFor(() =>
       
            Routes.forEach((route) => {
                screen.getByTestId(`SideNav/${route.name}-button`);
            }),
        );

    Routes.forEach((route) => {
        expect(screen.getByTestId(`SideNav/${route.name}-button`)).toHaveTextContent(`${route.name}`);
    });

    Routes.forEach((route) => {
        expect(screen.getByTestId(`SideNav/${route.name}-button`)).not.toBeDisabled();
    });
});
