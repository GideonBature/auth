import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { GettingStartedUser, User } from '@prisma/client';
import { errorNames, HandleApiError, responseHandler } from '../../../../../shared';
import { CredentialServices } from './credential.services';
import { CredentialSharedServices } from './credential.shared';
import {
    TEmailOtpSend,
    TForgetPasswordInput,
    TPartialUserRegisterInput,
    TResetPasswordInput,
    TUserLoginInput,
    TUserLoginResponse,
    TEmailVerification,
} from './credential.types';

const { updateUserById } = CredentialSharedServices;

export class CredentialControllers {
    constructor(readonly credentialServices: CredentialServices) {}

    async createPartialUser(req: Request, res: Response): Promise<void> {
        const result = await this.credentialServices.createPartialUser(
            req.body as TPartialUserRegisterInput
        );

        responseHandler<GettingStartedUser>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'partial user created successfully!',
            data: result,
        });
    }

    async emailVerification(req: Request, res: Response): Promise<void> {
        const result = await this.credentialServices.emailVerification(
            req.body as TEmailVerification
        );

        responseHandler<Omit<User, 'password'>>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'email verification successfully!',
            data: result as Omit<User, 'password'>,
        });
    }

    async loginUser(req: Request, res: Response): Promise<void> {
        const result = await this.credentialServices.loginUser(req.body as TUserLoginInput);
        const { refreshToken, userExists, ...rest } = result as TUserLoginResponse;

        let newRefreshTokenArray = userExists.refreshToken as string[] | [];

        if (newRefreshTokenArray.length >= 3) {
            newRefreshTokenArray = [refreshToken];
        } else {
            newRefreshTokenArray = [...newRefreshTokenArray, refreshToken];
        }
        // if cookie contain a rt thats exist in rt array in db, then remove only that rt from rt array
        // if (existedRefreshToken ) {
        //     newRefreshTokenArray = newRefreshTokenArray.filter(
        //         (rt) => rt !== existedRefreshToken
        //     );
        //     // if cookie contain a rt thats not exist in rt array in db, then remove all rt from db
        //     const foundToken = userExists.refreshToken?.find((rt) => rt === existedRefreshToken );
        //     if (!foundToken) {
        //         newRefreshTokenArray = [];
        //         res.clearCookie('refreshToken', cookieOptions);
        //     }
        // }

        // newRefreshTokenArray = [...newRefreshTokenArray, refreshToken];

        await updateUserById(userExists.id, {
            refreshToken: newRefreshTokenArray,
        });

        // res.cookie('refreshToken', refreshToken);
        // res.cookie('accessToken', rest.accessToken, cookieOptions);

        responseHandler<Omit<TUserLoginResponse, 'userExists'>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'user logged in successfully!',
            data: { ...rest, refreshToken },
        });
    }

    async forgetPasswordOtpSend(req: Request, res: Response): Promise<void> {
        const result = await this.credentialServices.otpSend(req.body as TEmailOtpSend);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Otp sent successfully',
            data: result,
        });
    }

    async forgetPassword(req: Request, res: Response): Promise<void> {
        const result = await this.credentialServices.forgetPassword(
            req.body as TForgetPasswordInput
        );

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'password changed successfully!',
            data: result,
        });
    }

    async refreshAccessToken(req: Request, res: Response): Promise<void> {
        const refreshToken = req.headers.authorization;
        if (!refreshToken) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'invalid token!'
            );
        }

        const result = await this.credentialServices.refreshAccessToken(refreshToken);
        responseHandler<Omit<TUserLoginResponse, 'userExists'>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'token refreshed successfully!',
            data: result as Omit<TUserLoginResponse, 'userExists'>,
        });
    }

    async changePassword(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;

        const result = await this.credentialServices.changePassword(
            req.body as TResetPasswordInput,
            userId
        );

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'password reset successfully!',
            data: result,
        });
    }

    // async logoutUser(req: Request, res: Response): Promise<void> {
    //     const { refreshToken } = req.cookies as TRefreshToken;
    //     if (!refreshToken) {
    //         throw new HandleApiError(
    //             errorNames.UNAUTHORIZED,
    //             httpStatus.UNAUTHORIZED,
    //             'invalid token!'
    //         );
    //     }
    //     res.clearCookie('refreshToken', cookieOptions);
    //     await this.credentialServices.logoutUser(refreshToken);

    //     responseHandler<object>(res, {
    //         statusCode: httpStatus.NO_CONTENT,
    //         success: true,
    //         message: 'user logged out successfully!',
    //         data: {},
    //     });
    // }

    // async verifyEmail(req: Request, res: Response): Promise<void> {
    //     const { token } = req.body as { token: string };
    //     await this.credentialServices.verifyEmail(token);

    //     responseHandler<object>(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: 'email verified successfully!',
    //         data: {},
    //     });
    // }
}
