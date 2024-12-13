import { TokenExpiredError } from 'jsonwebtoken';
import { TGenericErrorMessage } from '../@types';

export const handleTokenExpiredError = (err: TokenExpiredError) => {
    console.log('🌼 🔥🔥 handleJwtTokenError 🔥🔥 err🌼', err);

    const error = 'forbidden';
    const errors: TGenericErrorMessage[] = [
        {
            path: '',
            message: err?.message,
        },
    ];

    const statusCode = 403;
    return {
        error,
        statusCode,
        errorName: err?.name,
        errorMessages: errors,
    };
};
