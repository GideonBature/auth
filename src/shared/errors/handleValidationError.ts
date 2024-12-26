import { Prisma } from '@prisma/client';
import { TGenericErrorResponse } from '../@types/errorTypes';

export const handleValidationError = (
    err: Prisma.PrismaClientValidationError
): TGenericErrorResponse => {
    const regex = /Argument `(.+?)` is missing\./;
    const match = regex.exec(err.message);

    const errors = [
        {
            path: '',
            message: match ? `\`${match[1]}\` is missing.` : '',
        },
    ];
    const statusCode = 400;
    const error = 'Bad Request';
    return {
        error,
        statusCode,
        errorName: 'ValidationError',
        errorMessages: errors,
    };
};
// Compare this snippet from src/shared/errors/handleZodError.ts:
