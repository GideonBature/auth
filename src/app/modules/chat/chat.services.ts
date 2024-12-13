/* eslint-disable class-methods-use-this */
import { fileType, messageType } from '@prisma/client';
import { prisma } from '../../../shared';
import { backBlazeSingle } from '../../../shared/configs/backblazeSingle';
import { TFileSchema } from '../../../shared/middlewares/fileUpload';
import { TCreateChatType, TFileLoadSchema, TMessage, TMessageFile } from './chat.types';

export class ChatServices {
    async createChatService(data: TCreateChatType): Promise<object> {
        const { name, participantIds } = data;
        const chat = await prisma.chat.create({
            data: {
                name,
                participants: {
                    connect: participantIds.map((id) => ({ id })),
                },
            },
        });
        return chat;
    }

    async getChatByUserIdService(userId: string): Promise<object> {
        const chats = await prisma.chat.findMany({
            where: {
                participants: {
                    some: {
                        id: userId,
                    },
                },
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return chats;
    }

    async getChatByChatIdService({
        chatId,
        userId,
    }: {
        chatId: string;
        userId: string;
    }): Promise<object | null> {
        await prisma.message.updateMany({
            where: {
                chatId,
                receiverId: userId,
                status: 'sent',
            },
            data: {
                status: 'delivered',
            },
        });

        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                messages: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                    select: {
                        id: true,
                        content: true,
                        file: {
                            select: {
                                id: true,
                                createdAt: true,
                                size: true,
                                url: true,
                                type: true,
                                name: true,
                            },
                        },
                        type: true,
                        createdAt: true,
                        senderId: true,
                        receiverId: true,
                        chatId: true,
                        status: true,
                    },
                },
            },
        });
        return chat;
    }

    async updateMessageStatusService({
        userId,
        chatId,
    }: {
        userId: string;
        chatId: string;
    }): Promise<object | null> {
        await prisma.message.updateMany({
            where: {
                chatId,
                receiverId: userId,
                status: { in: ['sent', 'delivered'] },
            },
            data: {
                status: 'read',
            },
        });

        return {};
    }

    async sendMessageService(data: TMessage): Promise<object | null> {
        const { chatId, content, senderId, type, receiverId } = data;
        const message = await prisma.message.create({
            data: {
                chatId,
                senderId,
                receiverId,
                content,
                type,
            },
        });

        return message;
    }

    async uploadFileService(file: TFileSchema, data: TMessageFile): Promise<object | null> {
        console.log('🚀 ~ file:', file);
        const response = await backBlazeSingle(file);

        const { chatId, senderId, receiverId } = data;

        let type = file.mimetype.split('/')[0] as messageType;
        if (file.mimetype === 'application/pdf') {
            type = file.mimetype.split('/')[1] as messageType;
        }
        console.log('🚀 ~ ChatServices ~ uploadFileService ~ typeOfFile:', type);

        const message = await prisma.message.create({
            data: {
                chatId,
                senderId,
                receiverId,
                type,
            },
        });

        let typeOfFile = file.mimetype.split('/')[0] as fileType;
        if (file.mimetype === 'application/pdf') {
            typeOfFile = file.mimetype.split('/')[1] as fileType;
        }

        const fileSize = parseFloat((file.size / (1024 * 1024)).toFixed(2));
        const messageFile = await prisma.file.create({
            data: {
                messageId: message.id,
                chatId,
                url: response,
                type: typeOfFile,
                size: fileSize,
                name: file.originalname,
            },
        });
        console.log('🚀 ~ router.post ~ response:', response);
        console.log('🚀 ~ ChatServices ~ uploadFileService ~ message:', message);

        return messageFile;
    }

    async getFilesByChatIdService(data: TFileLoadSchema): Promise<object | null> {
        const { chatId, type } = data;
        const files = await prisma.file.findMany({
            where: {
                chatId,
                type, // Make sure to cast fileType to the correct enum type
            },
            select: {
                id: true, // Load only the necessary properties
                url: true,
                type: true,
                createdAt: true,
                name: true,
            },
            orderBy: {
                createdAt: 'desc', // Sort by most recent createdAt first
            },
        });
        return files;
    }
}
