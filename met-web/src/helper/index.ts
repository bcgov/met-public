const replaceUrl = (URL: string, key: string, value: string) => {
    return URL.replace(key, value);
};

interface Params {
    [param: string]: string;
}
const replaceAllInURL = ({ URL, params }: { URL: string; params: Params }) => {
    const regex = new RegExp(Object.keys(params).join('|'), 'gi');

    return URL.replace(regex, function (matched) {
        return params[matched];
    });
};

const filterQueryParams = (queryParams: { [x: string]: unknown }) => {
    const filteredQueryParams: { [x: string]: unknown } = {};
    Object.keys(queryParams).forEach((key) => {
        if (queryParams[key]) {
            filteredQueryParams[key] = queryParams[key];
        }
    });
    return filteredQueryParams;
};

export { replaceUrl, replaceAllInURL, filterQueryParams };
