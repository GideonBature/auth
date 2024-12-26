import { Prisma } from '@prisma/client';
import { TGenericErrorMessage, TGenericErrorResponse } from '../@types/errorTypes';

export const handleClientError = (
    err: Prisma.PrismaClientKnownRequestError
): TGenericErrorResponse => {
    let errors: TGenericErrorMessage[] = [];
    const error = 'Bad Request';
    let errorName = '';
    const statusCode = 400;
    console.log('🌼 🔥🔥 statusCode🌼', err.message);

    if (err.code === 'P2025') {
        errorName = (err.meta?.cause as string) || 'Record is required!';
        errors = [
            {
                path: '',
                message: errorName,
            },
        ];
    }
    if (err.code === 'P2002') {
        errorName = err.name || 'Unique constraint error!';
        const path = (err.meta?.target as string[]) || [];
        errors = [
            {
                path: path[0],
                message: `unique constraint error on field ${
                    err.message.match(/(?<=\().+?(?=\))/g)?.[0]
                }`,
            },
        ];
    }
    if (err.code === 'P2021') {
        errorName = (err.meta?.cause as string) || 'table not found!';
        errors = [
            {
                path: '',
                message: errorName,
            },
        ];
    }
    if (err.code === 'P2022') {
        errorName = (err.meta?.cause as string) || 'column not found!';
        errors = [
            {
                path: '',
                message: errorName,
            },
        ];
    } else if (err.code === 'P2003') {
        if (err.message.includes('delete()` invocation:')) {
            errorName = 'Delete failed';
            errors = [
                {
                    path: '',
                    message: errorName,
                },
            ];
        }
    }

    return {
        error,
        statusCode,
        errorName,
        errorMessages: errors,
    };
};
