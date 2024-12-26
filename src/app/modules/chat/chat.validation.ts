// import { AddressProofDocType } from '@prisma/client';
import { z } from 'zod';

export const createChatZodSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'name is required',
            })
            .trim(),
        participantIds: z.array(z.string(), { required_error: 'participantIds is required' }),
    }),
});

export const createMessageZodSchema = z.object({
    body: z.object({
        chatId: z.string({ required_error: 'chatId is required' }),
        senderId: z.string({ required_error: 'senderId is required' }),
        receiverId: z.string({ required_error: 'receiverId is required' }),
        content: z.string({ required_error: 'content is required' }),
        type: z.enum(['image', 'pdf', 'audio', 'video', 'text', 'invoice']),
    }),
});
export const loadFileZodSchema = z.object({
    query: z.object({
        chatId: z.string({ required_error: 'chatId is required' }),
        type: z.enum(['image', 'pdf', 'audio', 'video']),
    }),
});
