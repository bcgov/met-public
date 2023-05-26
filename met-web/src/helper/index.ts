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
