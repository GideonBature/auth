/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { responseHandler } from '../../../shared';
import { ChatServices } from './chat.services';
import { TCreateChatType, TFileLoadSchema, TMessage, TMessageFile } from './chat.types';
import { TFileSchema } from '../../../shared/middlewares/fileUpload';

export class ChatControllers {
    constructor(readonly chatServices: ChatServices) {}

    async createChatController(req: Request, res: Response): Promise<void> {
        const result = await this.chatServices.createChatService(req.body as TCreateChatType);

        responseHandler<object>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Chat created successfully',
            data: result,
        });
    }

    async getChatByUserIdController(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;
        const result = await this.chatServices.getChatByUserIdService(userId);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Chat retrieved successfully',
            data: result,
        });
    }

    async getChatByChatIdController(req: Request, res: Response): Promise<void> {
        const chatId = req.params.id;
        const userId = req.user?.id as string;
        const result = await this.chatServices.getChatByChatIdService({ chatId, userId });

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Chat retrieved successfully',
            data: result,
        });
    }

    async updateMessageStatusController(req: Request, res: Response): Promise<void> {
        const chatId = req.params.id;
        const userId = req.user?.id as string;
        const result = await this.chatServices.updateMessageStatusService({ userId, chatId });

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Message status updated successfully',
            data: result,
        });
    }

    async sendMessageController(req: Request, res: Response): Promise<void> {
        const result = await this.chatServices.sendMessageService(req.body as TMessage);

        responseHandler<object>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Message send successfully',
            data: result,
        });
    }

    async uploadFileController(req: Request, res: Response): Promise<void> {
        const result = await this.chatServices.uploadFileService(
            req.file as TFileSchema,
            JSON.parse(req?.body?.data as string) as TMessageFile
        );

        responseHandler<object>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'File uploaded successfully',
            data: result,
        });
    }

    async getFilesByChatIdController(req: Request, res: Response): Promise<void> {
        const result = await this.chatServices.getFilesByChatIdService(
            req.query as TFileLoadSchema
        );

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Files retrieved successfully',
            data: result,
        });
    }
}
