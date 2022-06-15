import axios from 'axios';
import { AppConfig } from '../../config';
import UserService from '../../services/userService';

export default axios.create({
    baseURL: AppConfig.apiUrl,
    headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${UserService.getToken()}`,
    },
});

export const httpGETRequest = (url: string, params = {}) => {
    const fullUrl = AppConfig.apiUrl + url;
    return axios.get(fullUrl, {
        params: params,
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
};

export const httpPOSTRequest = (url: string, data = {}) => {
    const fullUrl = AppConfig.apiUrl + url;
    return axios.post(fullUrl, data, {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
};

export const httpPUTRequest = (url: string, data = {}) => {
    const fullUrl = AppConfig.apiUrl + url;
    return axios.put(fullUrl, data, {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
};
