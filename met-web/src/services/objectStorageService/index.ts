import http from 'apiManager/httpRequestHandler';
import API from 'apiManager/endpoints';
import { ObjectStorageFileDetails, ObjectStorageHeaderDetails } from './types';

const getOSSHeaderDetails = async (data: ObjectStorageFileDetails) => {
    return await http.PostRequest<ObjectStorageHeaderDetails[]>(API.Document.OSS_HEADER, [data]);
};

const getObject = async (headerDetails: ObjectStorageHeaderDetails) => {
    return await http.OSSGetRequest(headerDetails.filepath, {
        amzDate: headerDetails.amzdate,
        authHeader: headerDetails.authheader,
    });
};

export const downloadObject = async (file: ObjectStorageFileDetails) => {
    const response = await getOSSHeaderDetails(file);
    if (!response.data) {
        throw Error('Error occurred while fetching document from the object storage');
    }
    return await getObject(response.data[0]);
};

const doSaveObjectRequest = async (headerDetails: ObjectStorageHeaderDetails, file: File) => {
    return await http.OSSPutRequest(headerDetails.filepath, file, {
        amzDate: headerDetails.amzdate,
        authHeader: headerDetails.authheader,
    });
};

export const saveObject = async (file: File, fileDetails: ObjectStorageFileDetails) => {
    const fileDetailsResponse = await getOSSHeaderDetails(fileDetails);
    if (!fileDetailsResponse.data) {
        throw Error('Error occurred while fetching document from the object storage');
    }
    await doSaveObjectRequest(fileDetailsResponse.data[0], file);
    return fileDetailsResponse.data[0];
};
