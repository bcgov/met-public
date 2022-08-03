import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { EmailVerification } from 'models/emailVerification';

export const getEmailVerification = async (token: string): Promise<EmailVerification> => {
    if (!token) {
        return Promise.reject('Invalid Token');
    }
    try {
        const url = replaceUrl(Endpoints.EmailVerification.GET, 'verification_token', token);
        const response = await http.GetRequest<EmailVerification>(url);
        if (response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to fetch email verification');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const createEmailVerification = async (request: EmailVerification): Promise<EmailVerification> => {
    try {
        const response = await http.PostRequest<EmailVerification>(Endpoints.EmailVerification.CREATE, request);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to create email verification');
    } catch (err) {
        return Promise.reject(err);
    }
};
