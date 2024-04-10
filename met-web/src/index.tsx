import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { BaseTheme } from 'styles/Theme';
import { Formio } from '@formio/react';
import MetFormioComponents from 'met-formio';
import '@bcgov/bc-sans/css/BCSans.css';
import { HelmetProvider } from 'react-helmet-async';
import { AuthKeyCloakContextProvider } from 'components/auth/AuthKeycloakContext';

Formio.use(MetFormioComponents);
Formio.Utils.Evaluator.noeval = false;

// eslint-disable-next-line
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    // <React.StrictMode>

    <HelmetProvider>
        <Provider store={store}>
            <AuthKeyCloakContextProvider>
                <ThemeProvider theme={BaseTheme}>
                    <StyledEngineProvider injectFirst>
                        <App />
                    </StyledEngineProvider>
                </ThemeProvider>
            </AuthKeyCloakContextProvider>
        </Provider>
    </HelmetProvider>,

    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
