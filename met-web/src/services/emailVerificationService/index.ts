import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { EmailVerification, EmailVerificationType } from 'models/emailVerification';

export const getEmailVerification = async (token: string): Promise<EmailVerification> => {
    if (!token) {
        return Promise.reject('Invalid Token');
    }
    const url = replaceUrl(Endpoints.EmailVerification.GET, 'verification_token', token);
    const response = await http.GetRequest<EmailVerification>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch email verification');
};

export const verifyEmailVerification = async (token: string): Promise<EmailVerification> => {
    if (!token) {
        return Promise.reject('Invalid Token');
    }
    const url = replaceUrl(Endpoints.EmailVerification.UPDATE, 'verification_token', token);
    const response = await http.PutRequest<EmailVerification>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch email verification');
};

interface CreateEmailVerification {
    email_address: string;
    survey_id: number;
    type: EmailVerificationType;
}
export const createEmailVerification = async (request: CreateEmailVerification): Promise<EmailVerification> => {
    try {
        const response = await http.PostRequest<EmailVerification>(Endpoints.EmailVerification.CREATE, request);
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};
