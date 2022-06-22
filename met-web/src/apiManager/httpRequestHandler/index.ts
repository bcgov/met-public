import axios from 'axios';
import UserService from 'services/userService';

const GetRequest = (url: string, params = {}) => {
    return axios.get(url, {
        params: params,
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
};

const PostRequest = (url: string, data = {}) => {
    return axios.post(url, data, {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
};

const PutRequest = (url: string, data = {}) => {
    return axios.put(url, data, {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
};

export default {
    GetRequest,
    PostRequest,
    PutRequest,
};
