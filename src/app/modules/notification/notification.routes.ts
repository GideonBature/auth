import { Request, Response, Router } from 'express';
import { asyncHandler, zodValidator } from '../../../shared';
import { NotificationModules } from './notification.modules';
import { notificationInputZodSchema } from './notification.validation';
import { sendNotificationToUser } from '../../../shared/socket/utility/notification';

const router = Router();
const NotificationsModules = new NotificationModules();
const { getNotificationsUnread, updateNotifications } =
    NotificationsModules.notificationControllers;

// test notification module
router.get('/test-notification', async (req: Request, res: Response) => {
    await sendNotificationToUser('dapimob515@edectus.com', {
        title: 'test hello',
        message: 'hello this is testing',
    });
    res.status(200).json({
        status: 'success',
        message: 'Notification sent successfully',
    });
});

router.get(
    '/get-unread',
    zodValidator(notificationInputZodSchema),
    asyncHandler(getNotificationsUnread.bind(NotificationsModules.notificationControllers))
);

router.patch(
    '/update',
    zodValidator(notificationInputZodSchema),
    asyncHandler(updateNotifications.bind(NotificationsModules.notificationControllers))
);

export const notificationRoutes = router;
