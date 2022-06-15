import axios from 'axios';
import { AppConfig } from '../../config';
import UserService from '../../services/userService';

export const httpGETRequest = (url: string, params = {}) => {
    return axios.get(url, {
        params: params,
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
};

export const httpPOSTRequest = (url: string, data = {}) => {
    return axios.post(url, data, {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
};

export const httpPUTRequest = (url: string, data = {}) => {
    return axios.put(url, data, {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
};
