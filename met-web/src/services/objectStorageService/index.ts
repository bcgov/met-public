import http from 'apiManager/httpRequestHandler';
import API from 'apiManager/endpoints';
import { ObjectStorageFileDetails, ObjectStorageHeaderDetails } from './types';

const getOSSHeaderDetails = async (data: ObjectStorageFileDetails) => {
    try {
        return await http.PostRequest<ObjectStorageHeaderDetails[]>(API.Document.OSS_HEADER, [data]);
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};

const getFile = async (headerDetails: ObjectStorageHeaderDetails) => {
    try {
        return await http.OSSGetRequest(headerDetails.filepath, {
            amzDate: headerDetails.amzdate,
            authHeader: headerDetails.authheader,
        });
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};

const saveFile = async (headerDetails: ObjectStorageHeaderDetails, file: File) => {
    try {
        return await http.OSSPutRequest(headerDetails.filepath, file, {
            amzDate: headerDetails.amzdate,
            authHeader: headerDetails.authheader,
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

export const downloadDocument = async (file: ObjectStorageFileDetails) => {
    try {
        const response = await getOSSHeaderDetails(file);
        if (!response.data.result) {
            throw Error('Error occurred while fetching document from the object storage');
        }
        return await getFile(response.data.result[0]);
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};

export const saveDocument = async (file: File, fileDetails: ObjectStorageFileDetails) => {
    try {
        const fileDetailsResponse = await getOSSHeaderDetails(fileDetails);
        if (!fileDetailsResponse.data.result) {
            throw Error('Error occurred while fetching document from the object storage');
        }
        await saveFile(fileDetailsResponse.data.result[0], file);
        return fileDetailsResponse.data.result[0];
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};
