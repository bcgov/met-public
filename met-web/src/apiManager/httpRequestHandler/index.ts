import axios from 'axios';
import UserService from 'services/userService';
import { ApiResponse } from './types';

const GetRequest = <T>(url: string, params = {}) => {
    return axios.get<ApiResponse<T>>(url, {
        params: params,
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
};

const PostRequest = <T>(url: string, data = {}) => {
    return axios.post<ApiResponse<T>>(url, data, {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
};

const PutRequest = <T>(url: string, data = {}) => {
    return axios.put<ApiResponse<T>>(url, data, {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
};

interface OSSRequestOptions {
    amzDate: string;
    authHeader: string;
}
export const OSSGetRequest = <T>(url: string, requestOptions: OSSRequestOptions) => {
    return axios.get<ApiResponse<T>>(url, {
        headers: {
            'X-Amz-Date': requestOptions.amzDate,
            Authorization: requestOptions.authHeader,
        },
        responseType: 'blob',
    });
};

export const OSSPutRequest = <T>(url: string, data: File, requestOptions: OSSRequestOptions) => {
    return axios.put<ApiResponse<T>>(url, data, {
        headers: {
            'X-Amz-Date': requestOptions.amzDate,
            Authorization: requestOptions.authHeader,
        },
    });
};
export default {
    GetRequest,
    PostRequest,
    PutRequest,
    OSSGetRequest,
    OSSPutRequest,
};
