import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { NotificationService } from './notification.services';

export class NotificationController {
    constructor(readonly NotificationServices: NotificationService) {}

    async getNotificationsUnread(req: Request, res: Response): Promise<void> {
        const userId = req.query.userId as string | undefined;
        const result = await this.NotificationServices.getNotificationsUnread(userId);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Successfully retrieved unread the notifications!',
            data: result,
        });
    }

    async updateNotifications(req: Request, res: Response): Promise<void> {
        const userId = req.query.userId as string | undefined;
        const result = await this.NotificationServices.updateNotifications(userId);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Successfully updated the notifications!',
            data: result,
        });
    }
}
