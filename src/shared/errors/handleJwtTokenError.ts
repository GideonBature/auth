import { JsonWebTokenError } from 'jsonwebtoken';
import { TGenericErrorMessage } from '../@types';

export const handleJwtTokenError = (err: JsonWebTokenError) => {
    let error = 'Unauthorized';
    let statusCode = 401;
    if (err.name === 'TokenExpiredError') {
        error = 'Forbidden';
        statusCode = 403;
    }

    const errors: TGenericErrorMessage[] = [
        {
            path: '',
            message: err?.message,
        },
    ];

    return {
        error,
        statusCode,
        errorName: err?.name,
        errorMessages: errors,
    };
};
