import { Response } from 'express';
import { TApiResponse, TDirectResponse } from '../@types/responseTypes';

export const responseHandler = <T>(res: Response, data: TApiResponse<T>): void => {
    const responseData: TApiResponse<T> = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || null,
        meta: data.meta || null || undefined,
        data: data.data || null,
    };

    res.status(data.statusCode).json(responseData);
};
export const sendDirectResponse = <T>(res: Response, data: TDirectResponse<T>): void => {
    const responseData: TDirectResponse<T> = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || null,
        token: data.token,
    };

    res.status(data.statusCode).json(responseData);
};
