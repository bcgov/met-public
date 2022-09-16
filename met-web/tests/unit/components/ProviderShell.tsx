import React from 'react';
import { BaseTheme } from '../../../src/styles/Theme';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../src/store';

type ProviderProps = {
    children: React.ReactNode; // 👈️ type children
};

function ProviderShell({ children }: ProviderProps) {
    return (
        <ThemeProvider theme={BaseTheme}>
            <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
        </ThemeProvider>
    );
}

export default ProviderShell;
