import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { Contact } from 'models/contact';

/**
 * @deprecated The method was replaced by Redux RTK query to have caching behaviour
 */
export const getContact = async (contactId: number): Promise<Contact> => {
    const url = replaceUrl(Endpoints.Contacts.GET, 'contact_id', String(contactId));
    try {
        const response = await http.GetRequest<Contact>(url);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to fetch contact');
    } catch (err) {
        return Promise.reject(err);
    }
};

/**
 * @deprecated The method was replaced by Redux RTK query to have caching behaviour
 */
export const getContacts = async (): Promise<Contact[]> => {
    try {
        const response = await http.GetRequest<Contact[]>(Endpoints.Contacts.GET_LIST);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to fetch contacts');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostContactRequest {
    name?: string;
    title?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    bio?: string;
    avatar_filename?: string;
}

export interface PatchContactRequest {
    id: number;
    name?: string;
    title?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    bio?: string;
    avatar_filename?: string;
}

export const postContact = async (data: PostContactRequest): Promise<Contact> => {
    try {
        const response = await http.PostRequest<Contact>(Endpoints.Contacts.CREATE, data);
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};
export const patchContact = async (data: PatchContactRequest): Promise<Contact> => {
    try {
        const response = await http.PatchRequest<Contact>(Endpoints.Contacts.UPDATE, data);
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};
