/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorRequestHandler } from 'express';

import { ZodError } from 'zod';

import { Prisma } from '@prisma/client';
import { JsonWebTokenError } from 'jsonwebtoken';
import { TGenericErrorMessage } from '../@types/errorTypes';
import { configs } from '../configs/env.configs';
import {
    HandleApiError,
    handleClientError,
    handleJwtTokenError,
    handleValidationError,
    handleZodError,
} from '../errors';

import { errorLogger } from '../utils/logger';

export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (configs.env === 'development') {
        console.log('🌼 ----------------------------------------------------------🌼');
        console.log('🌼 🔥🔥 file: globalErrorHandler.ts:26 🔥🔥 error🌼', err);
        console.log('🌼 ----------------------------------------------------------🌼');
        errorLogger.error(err);
    } else {
        errorLogger.error(err);
    }
    let error = 'Internal Server Error';
    let statusCode = 500;
    let errorName = 'Something went wrong!';
    let errorMessages: TGenericErrorMessage[] = [];

    // zod error handler
    if (err instanceof ZodError) {
        const simplifiedError = handleZodError(err);
        error = simplifiedError.error;
        statusCode = simplifiedError.statusCode;
        errorName = simplifiedError.errorName;
        errorMessages = simplifiedError.errorMessages;
    }
    // prisma validation err handler
    else if (err instanceof Prisma.PrismaClientValidationError) {
        const simplifiedError = handleValidationError(err);
        error = simplifiedError.error;
        statusCode = simplifiedError.statusCode;
        errorName = simplifiedError.errorName;
        errorMessages = simplifiedError.errorMessages;
    }
    // prisma known err handler
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = handleClientError(err);
        error = simplifiedError.error;
        statusCode = simplifiedError.statusCode;
        errorName = simplifiedError.errorName;
        errorMessages = simplifiedError.errorMessages;
    }
    // jwt err handler
    else if (err instanceof JsonWebTokenError) {
        console.log(err.name);
        const simplifiedError = handleJwtTokenError(err);
        error = simplifiedError.error;
        statusCode = simplifiedError.statusCode;
        errorName = simplifiedError.errorName;
        errorMessages = simplifiedError.errorMessages;
    }

    // api err handler
    else if (err instanceof HandleApiError) {
        statusCode = err?.statusCode;
        error = err.error;
        errorName = err.message;
        errorMessages = err?.message
            ? [
                  {
                      path: '',
                      message: err?.message,
                  },
              ]
            : [];
    }
    // node default err handler
    else if (err instanceof Error) {
        errorMessages = err?.message
            ? [
                  {
                      path: '',
                      message: err?.message,
                  },
              ]
            : [];
    }
    // err response provider
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        error: configs.env !== 'production' ? error : undefined,
        errorName,
        errorMessages,
        stack: configs.env !== 'production' ? err?.stack : undefined,
    });
};
