import UserService from 'services/userService';

export const prepareHeaders = (headers: Headers) => {
    headers.set('authorization', `Bearer ${UserService.getToken()}`);
    headers.set('tenant-id', `${sessionStorage.getItem('tenantId')}`);
    return headers;
};
