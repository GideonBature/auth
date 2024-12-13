import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import { configs } from '../configs/env.configs';
import { HandleApiError } from '../errors';
import { errorNames } from '../errors/errorNames';
import { jwtHelpers } from '../helpers';

export const roleVerifier =
    (...requiredRoles: string[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
        try {
            // get authorization token
            const token = req.header('Authorization');
            console.log('🚀 ~ token: hello world hello world', token);

            if (!token) {
                throw new HandleApiError(
                    errorNames.UNAUTHORIZED,
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized'
                );
            }
            // verify token
            let verifiedUser = null;

            verifiedUser = jwtHelpers.verifyToken(token, configs.jwtSecretAccess as Secret);
            console.log('🚀 ~ verifiedUser:', verifiedUser);

            req.user = verifiedUser;

            if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role as string)) {
                throw new HandleApiError(errorNames.FORBIDDEN, httpStatus.FORBIDDEN, 'Forbidden');
            }
            next();
        } catch (error) {
            next(error);
        }
    };
