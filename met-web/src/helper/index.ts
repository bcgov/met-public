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

export { replaceUrl, replaceAllInURL };
