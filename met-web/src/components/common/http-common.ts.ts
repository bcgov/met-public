import axios from 'axios';
import { API_URL } from '../../constants/constants';
import UserService from '../../services/UserServices';

export default axios.create({
    baseURL: API_URL,
    headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${UserService.getToken()}`,
    },
});
