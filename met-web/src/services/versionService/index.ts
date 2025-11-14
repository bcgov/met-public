import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';

export interface VersionInfo {
    commit: string;
    build_date: string;
    version: string;
    branch: string;
    commit_url?: string;
}

export const fetchVersion = async (): Promise<VersionInfo> => {
    const url = `${Endpoints.Version.GET}`;
    const response = await http.GetRequest<VersionInfo>(url);
    return response.data;
};
