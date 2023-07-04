import { AppConfig } from 'config';

export const replaceUrl = (URL: string, key: string, value: string) => {
    return URL.replace(key, value);
};

interface Params {
    [param: string]: string;
}
export const replaceAllInURL = ({ URL, params }: { URL: string; params: Params }) => {
    const regex = new RegExp(Object.keys(params).join('|'), 'gi');

    return URL.replace(regex, function (matched) {
        return params[matched];
    });
};

export const getBaseUrl = () => {
    const tenantId = sessionStorage.getItem('tenantId');
    const domain = AppConfig.publicUrl ? AppConfig.publicUrl : window.location.origin;
    const baseUrl = `${domain}/${tenantId}`;
    return baseUrl;
};

export const filterQueryParams = (queryParams: { [x: string]: unknown }) => {
    const filteredQueryParams: { [x: string]: unknown } = {};
    Object.keys(queryParams).forEach((key) => {
        if (queryParams[key]) {
            filteredQueryParams[key] = queryParams[key];
        }
    });
    return filteredQueryParams;
};

// used to measure the distance (similarity/difference) between two strings
export const levenshteinDistance = (string1: string, string2: string): number => {
    if (string1.length < string2.length) {
        return levenshteinDistance(string2, string1);
    }
    if (string2.length === 0) {
        return string1.length;
    }
    const previousRow = Array.from({ length: string2.length + 1 }, (_, i) => i);
    for (let i = 0; i < string1.length; i++) {
        const currentRow = [i + 1];
        for (let j = 0; j < string2.length; j++) {
            const insertions = previousRow[j + 1] + 1;
            const deletions = currentRow[j] + 1;
            const substitutions = previousRow[j] + (string1[i] !== string2[j] ? 1 : 0);
            currentRow.push(Math.min(insertions, deletions, substitutions));
        }
        previousRow.splice(0, previousRow.length, ...currentRow);
    }
    return previousRow[string2.length];
};
