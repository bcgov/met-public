// Determines whether a string is JSON parseable and returns the JSON if it is.
export const tryParse = (json: string) => {
    try {
        const object = JSON.parse(json);
        if (object && typeof object === 'object') {
            return object;
        }
    } catch {}
    return false;
};
