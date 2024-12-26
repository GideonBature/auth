/* eslint-disable class-methods-use-this */
import httpStatus from 'http-status';

import {
    HandleApiError,
    // configs,
    errorNames,
    // exclude,
    // jwtHelpers,
    prisma,
} from '../../../shared';
// import { MailOptions, sendMail } from '../../../shared/mail/mailService';

export class NotificationService {
    getNotificationsUnread = async (userId: string | undefined): Promise<object | null> => {
        const unreadNotifications = await prisma.notification.findMany({
            where: {
                userId,
                isRead: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (unreadNotifications.length === 0) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.BAD_REQUEST,
                'No unread notifications found'
            );
        }
        return unreadNotifications;
    };

    updateNotifications = async (userId: string | undefined): Promise<object | null> => {
        const update = await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });

        if (update.count === 0) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.BAD_REQUEST,
                'No unread notifications found'
            );
        }
        return update;
    };
}
