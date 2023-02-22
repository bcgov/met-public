import React from 'react';
import ReactDOM from 'react-dom/client';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Test from 'Test';

export default class SampleWC extends HTMLElement {
    connectedCallback() {
        const shadowContainer = this.attachShadow({ mode: 'open' });
        const emotionRoot = document.createElement('style');
        const shadowRootElement = document.createElement('div');
        shadowContainer.appendChild(emotionRoot);
        shadowContainer.appendChild(shadowRootElement);

        const cache = createCache({
            key: 'css',
            prepend: true,
            container: emotionRoot,
        });
        const shadowTheme = createTheme({});

        ReactDOM.createRoot(shadowRootElement).render(
            <React.StrictMode>
                <CacheProvider value={cache}>
                    <ThemeProvider theme={shadowTheme}>
                        <Typography>Shadow DOM</Typography>
                        <Test />
                    </ThemeProvider>
                </CacheProvider>
            </React.StrictMode>,
        );
    }
}
customElements.define('sampmle-wc', SampleWC);
