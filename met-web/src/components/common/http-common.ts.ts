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
