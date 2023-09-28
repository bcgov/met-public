import React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { EngagementBanner } from '../../components/engagement/view/EngagementBanner/StandAloneBanner';
import createWcTheme from '../styles/wcTheme';
import { store } from '../../store';
import { PrimaryButton } from 'components/common';
import { Grid } from '@mui/material';

export default class EngagementBannerWC extends HTMLElement {
    root: any;
    observer: MutationObserver;
    shadowContainer: any;
    constructor(componentToMount: React.ComponentType) {
        super();
        this.observer = new MutationObserver(() => this.update());
        this.observer.observe(this, { attributes: true });
    }
    connectedCallback() {
        this.shadowContainer = this.attachShadow({ mode: 'open' });

        this.mount();
    }

    disconnectedCallback() {
        this.unmount();
        this.observer.disconnect();
    }

    mount() {
        const emotionRoot = document.createElement('style');
        const shadowRootElement = document.createElement('div');
        this.shadowContainer.appendChild(emotionRoot);
        this.shadowContainer.appendChild(shadowRootElement);

        const cache = createCache({
            key: 'css',
            prepend: true,
            container: emotionRoot,
        });
        const shadowTheme = createWcTheme(shadowRootElement);
        this.root = ReactDOM.createRoot(shadowRootElement);
        const props: any = {
            ...this.getProps(this.attributes),
            ...this.getEvents(),
        };
        this.root.render(
            <React.StrictMode>
                <Provider store={store}>
                    <CacheProvider value={cache}>
                        <ThemeProvider theme={shadowTheme}>
                            <EngagementBanner
                                surveyButton={
                                    <Grid
                                        item
                                        container
                                        direction={{ xs: 'column', sm: 'row' }}
                                        xs={12}
                                        justifyContent="flex-end"
                                    >
                                        <PrimaryButton onClick={() => window.open(props['engagementurl'], '_blank')}>
                                            View Engagement
                                        </PrimaryButton>
                                    </Grid>
                                }
                                engagementSlug={this._getSlugFromUrl(props['engagementurl'])}
                                {...props}
                            />
                        </ThemeProvider>
                    </CacheProvider>
                </Provider>
            </React.StrictMode>,
        );
    }

    unmount() {
        this.root.unmount();
    }

    update() {
        this.unmount();
        this.mount();
    }
    getProps(attributes: any) {
        return [...attributes]
            .filter((attr) => attr.name !== 'style')
            .map((attr) => this.convert(attr.name, attr.value))
            .reduce((props, prop) => ({ ...props, [prop.name]: prop.value }), {});
    }
    getEvents() {
        return Object.values(this.attributes)
            .filter((key) => /on([a-z].*)/.exec(key.name))
            .reduce(
                (events, ev) => ({
                    ...events,
                    [ev.name]: (args: any) => this.dispatchEvent(new CustomEvent(ev.name, { ...args })),
                }),
                {},
            );
    }
    convert(attrName: any, attrValue: any) {
        let value = attrValue;
        if (attrValue === 'true' || attrValue === 'false') value = attrValue === 'true';
        else if (!isNaN(attrValue) && attrValue !== '') value = +attrValue;
        else if (/^{.*}/.exec(attrValue)) value = JSON.parse(attrValue);
        return {
            name: attrName,
            value: value,
        };
    }
    _getSlugFromUrl(url: string) {
        return url.substring(url.lastIndexOf('/') + 1, url.length);
    }
}

customElements.define('engagement-banner-wc', EngagementBannerWC);
