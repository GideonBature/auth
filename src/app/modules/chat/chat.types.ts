import { fileType, messageType } from '@prisma/client';

export type TCreateChatType = {
    name: string;
    participantIds: string[];
};

export type TMessage = {
    chatId: string;
    senderId: string;
    receiverId: string;
    content: string;
    type: messageType;
    receiverEmail?: string;
};

export type TMessageFile = {
    chatId: string;
    senderId: string;
    receiverId: string;
    type: fileType;
};

export type TFileLoadSchema = {
    chatId: string;
    type: fileType;
};
