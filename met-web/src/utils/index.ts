import { AxiosResponse } from 'axios';

export function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
    if (typeof obj !== 'object' || !obj) {
        return false;
    }
    return key in obj;
}

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
}

export function checkEmail(email: string) {
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return filter.test(email);
}

export const downloadFile = (response: AxiosResponse<Blob, unknown>, filename: string) => {
    if (!filename) {
        throw new Error('Filename must be specified');
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
};

export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const blobToFile = (theBlob: Blob, fileName: string): File => {
    const file: Blob & { lastModifiedDate?: Date; name?: string } = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    file.lastModifiedDate = new Date();
    file.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
};

export const determinePathSegments = () => {
    const url = new URL(window.location.href);
    // filters out empty segments, which can occur if there are leading or trailing slashes in the pathname
    const pathSegments = url.pathname.split('/').filter((segment) => segment.trim() !== '');
    return pathSegments;
};

export const findTenantInPath = () => {
    // finding tenant from the path segments
    const pathSegments = determinePathSegments();
    return pathSegments.length > 0 ? pathSegments[0].toLowerCase() : '';
};
