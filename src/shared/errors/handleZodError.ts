import { ZodError, ZodIssue } from 'zod';
import { TGenericErrorMessage, TGenericErrorResponse } from '../@types/errorTypes';

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
    const errors: TGenericErrorMessage[] = err.issues.map((issue: ZodIssue) => {
        return {
            path: issue?.path[issue.path.length - 1],
            message: issue?.message,
        };
    });

    const statusCode = 400;
    const error = 'Bad Request';

    return {
        error,
        statusCode,
        errorName: 'zodError',
        errorMessages: errors,
    };
};
