import { PrismaClient } from '@prisma/client';
import { getOnlineUsers, getSocketInstance } from '../socket.config';

const prisma = new PrismaClient();

type NotificationData = {
    title: string;
    message: string;
};

export const sendNotificationToUser = async (
    email: string,
    notificationData: NotificationData
): Promise<void> => {
    const io = getSocketInstance();
    const onlineUsers = getOnlineUsers();
    const socketId = onlineUsers[email];

    if (!io) {
        console.error('Socket instance is not initialized.');
        return;
    }

    try {
        // Save notification to database
        const transactionResult = await prisma.$transaction(async (inner) => {
            const user = await inner.user.findUnique({
                where: { email },
            });

            if (!user) {
                throw new Error(`User with email ${email} not found.`);
            }

            const notification = await inner.notification.create({
                data: {
                    message: notificationData.message,
                    title: notificationData.title,
                    userId: user.id,
                    email: user.email,
                },
            });

            return notification;
        });

        console.log('🚀 ~ transactionResult:', transactionResult);

        if (socketId) {
            io.to(socketId).emit('notification', transactionResult); // Emit saved notification
            console.log(`Notification sent to ${email} (Socket ID: ${socketId})`);
        } else {
            console.log(`User with email ${email} is not online.`);
        }
    } catch (error) {
        console.error('Error saving notification:', error);
    }
};
