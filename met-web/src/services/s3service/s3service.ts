import http from 'apiManager/httpRequestHandler';
import API from 'apiManager/endpoints';
import { S3FileDetails, S3HeaderDetails } from './types';

export const getOSSHeaderDetails = async (data: S3FileDetails) => {
    try {
        return await http.PostRequest<S3HeaderDetails[]>(API.s3.OSS_HEADER, [data]);
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};

export const getFileFromS3 = async (headerDetails: S3HeaderDetails) => {
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

export const downloadDocument = async (file: S3FileDetails) => {
    try {
        const response = await getOSSHeaderDetails(file);
        if (!response.data.result) {
            throw Error('Error occurred while fetching document from S3');
        }
        return await getFileFromS3(response.data.result[0]);
    } catch (error) {
        console.log(error);
    }
};

export const saveFileToS3 = async (headerDetails: S3HeaderDetails, file: File) => {
    console.log('B');
    try {
        return await http.OSSPutRequest(headerDetails.filepath, file, {
            amzDate: headerDetails.amzdate,
            authHeader: headerDetails.authheader,
        });
    } catch (error) {
        console.log('B.error', error);
        return Promise.reject(error);
    }
};

export const saveDocument = async (file: File, fileDetails: S3FileDetails) => {
    try {
        const response = await getOSSHeaderDetails(fileDetails);
        if (!response.data.result) {
            throw Error('Error occurred while fetching document from S3');
        }
        return await saveFileToS3(response.data.result[0], file);
    } catch (error) {
        console.log('A.error', error);
    }
};
