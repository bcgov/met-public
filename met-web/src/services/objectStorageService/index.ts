import http from 'apiManager/httpRequestHandler';
import API from 'apiManager/endpoints';
import { ObjectStorageFileDetails, ObjectStorageHeaderDetails } from './types';

const getOSSHeaderDetails = async (data: ObjectStorageFileDetails) => {
    return await http.PostRequest<ObjectStorageHeaderDetails[]>(API.Document.OSS_HEADER, [data]);
};

const getFile = async (headerDetails: ObjectStorageHeaderDetails) => {
    return await http.OSSGetRequest(headerDetails.filepath, {
        amzDate: headerDetails.amzdate,
        authHeader: headerDetails.authheader,
    });
};

const saveFile = async (headerDetails: ObjectStorageHeaderDetails, file: File) => {
    return await http.OSSPutRequest(headerDetails.filepath, file, {
        amzDate: headerDetails.amzdate,
        authHeader: headerDetails.authheader,
    });
};

export const downloadDocument = async (file: ObjectStorageFileDetails) => {
    const response = await getOSSHeaderDetails(file);
    if (!response.data) {
        throw Error('Error occurred while fetching document from the object storage');
    }
    return await getFile(response.data[0]);
};

export const saveDocument = async (file: File, fileDetails: ObjectStorageFileDetails) => {
    const fileDetailsResponse = await getOSSHeaderDetails(fileDetails);
    if (!fileDetailsResponse.data) {
        throw Error('Error occurred while fetching document from the object storage');
    }
    await saveFile(fileDetailsResponse.data[0], file);
    return fileDetailsResponse.data[0];
};
