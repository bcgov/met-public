import http from 'apiManager/httpRequestHandler';
import API from 'apiManager/endpoints';
import { S3FileDetails, S3HeaderDetails } from './types';

// {
//     ministrycode: "Misc",
//     requestnumber: `U-00${requestId}`,
//     filestatustransition: file.category,
//     filename: file.filename,
//     s3sourceuri: file.documentpath
//   },

interface ApiResponse {
    status: boolean;
    message: string;
    id?: string;
    result?: S3HeaderDetails;
}
export const getOSSHeaderDetails = async (data: S3FileDetails) => {
    try {
        return await http.PostRequest<S3HeaderDetails>(API.s3.OSS_HEADER, data);
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};

export const getFileFromS3 = async (headerDetails: S3HeaderDetails) => {
    try {
        return await http.OSSGetRequest(headerDetails.filePath, headerDetails.headers);
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
        return await getFileFromS3(response.data.result);
    } catch (error) {
        console.log(error);
    }
};
