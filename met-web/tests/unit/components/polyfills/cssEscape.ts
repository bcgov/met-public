import cssEscape from 'css.escape';

/**
 * jsdom does not ship CSS.escape, but MUI relies on it when building selectors around generated IDs.
 * Provide the browser polyfill so selector queries stay valid during tests.
 */
type CssNamespace = {
    escape?: (value: string) => string;
};

const ensureCssEscape = () => {
    const globalObject =
        typeof globalThis.window === 'undefined' ? (globalThis as Window & typeof globalThis) : globalThis.window;
    const cssNamespace: CssNamespace = globalObject.CSS ?? {};

    if (typeof cssNamespace.escape !== 'function') {
        cssNamespace.escape = (value: string) => cssEscape(value);
    }

    globalObject.CSS = cssNamespace as typeof globalObject.CSS;
};

ensureCssEscape();
