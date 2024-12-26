export type TApiResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string | null;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
    data?: T | null;
};
export type TGenericResponse<T> = {
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: T;
};
export type TDirectResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string | null;
    token: T;
};
