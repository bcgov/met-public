import React from 'react';
import ReactDOM from 'react-dom/client';
import { CacheProvider } from '@emotion/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TileBlock from 'components/landing/TileBlock';
import { store } from '../store';

export default class EngagementTilesWC extends HTMLElement {
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
                <Provider store={store}>
                    <CacheProvider value={cache}>
                        <ThemeProvider theme={shadowTheme}>
                            <Router>
                                <TileBlock />
                            </Router>
                        </ThemeProvider>
                    </CacheProvider>
                </Provider>
            </React.StrictMode>,
        );
    }
}
customElements.define('engagement-tiles-wc', EngagementTilesWC);
