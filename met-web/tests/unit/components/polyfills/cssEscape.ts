import cssEscape from 'css.escape';

/**
 * jsdom does not ship CSS.escape, but MUI relies on it when building selectors around generated IDs.
 * Provide the browser polyfill so selector queries stay valid during tests.
 */
type CssNamespace = {
    escape?: (value: string) => string;
};

const ensureCssEscape = () => {
    const globalObject = globalThis.window ?? (globalThis as Window & typeof globalThis);
    const cssNamespace: CssNamespace = globalObject.CSS ?? {};

    if (typeof cssNamespace.escape !== 'function') {
        cssNamespace.escape = (value: string) => cssEscape(value);
    }

    globalObject.CSS = cssNamespace as typeof globalObject.CSS;
};

ensureCssEscape();
