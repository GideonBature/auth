import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { responseHandler } from '../../../shared';
import { UserServices } from './user.services';
import { TUpdateUserProfileInput } from './user.types';

export class UserControllers {
    constructor(readonly userServices: UserServices) {}

    async getUserProfile(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;

        const result = await this.userServices.getUserProfile(userId);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User information retrieved successfully',
            data: result,
        });
    }

    async updateUserProfile(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;

        const result = await this.userServices.updateUserProfile(
            userId,
            req.body as TUpdateUserProfileInput
        );

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User information updated successfully',
            data: result,
        });
    }
}
