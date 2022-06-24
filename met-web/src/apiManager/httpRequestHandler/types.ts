export interface ApiResponse<T = unknown> {
    status: boolean;
    message: string;
    id?: string;
    result?: T;
}
