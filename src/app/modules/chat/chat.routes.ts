/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Request, Response, Router } from 'express';
import { roleVerifier, zodValidator } from '../../../shared';
import { asyncHandler } from '../../../shared/helpers/asyncHandler';
import { ChatModules } from './chat.modules';
import { createChatZodSchema, createMessageZodSchema, loadFileZodSchema } from './chat.validation';
import { TFileSchema, upload } from '../../../shared/middlewares/fileUpload';
import { backBlazeSingle } from '../../../shared/configs/backblazeSingle';

const router = Router();
const chatModules = new ChatModules();
const {
    createChatController,
    getChatByUserIdController,
    getChatByChatIdController,
    sendMessageController,
    uploadFileController,
    getFilesByChatIdController,
    updateMessageStatusController,
} = chatModules.chatControllers;

router.post(
    '/create',
    roleVerifier('business'),
    zodValidator(createChatZodSchema),
    asyncHandler(createChatController.bind(chatModules))
);

router.get(
    '/get-by-participant',
    roleVerifier('business', 'lawyer'),
    asyncHandler(getChatByUserIdController.bind(chatModules))
);

router.get(
    '/get-by-id/:id',
    roleVerifier('business', 'lawyer'),
    asyncHandler(getChatByChatIdController.bind(chatModules))
);

router.patch(
    '/update-status/:id',
    roleVerifier('business', 'lawyer'),
    asyncHandler(updateMessageStatusController.bind(chatModules))
);

router.post(
    '/send-message',
    roleVerifier('business', 'lawyer'),
    zodValidator(createMessageZodSchema),
    asyncHandler(sendMessageController.bind(chatModules))
);

router.post(
    '/upload-file',
    roleVerifier('business', 'lawyer'),
    upload.single('media'),
    asyncHandler(uploadFileController.bind(chatModules))
);

router.get(
    '/get-file',
    roleVerifier('business', 'lawyer'),
    zodValidator(loadFileZodSchema),
    asyncHandler(getFilesByChatIdController.bind(chatModules))
);

export const chatRouters = router;
