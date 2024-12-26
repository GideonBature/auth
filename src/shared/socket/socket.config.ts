import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { prisma } from '../helpers';
import { TMessage } from '../../app/modules/chat/chat.types';

// type definitions
type OnlineUsers = {
    [email: string]: string;
};

let io: Server;
const onlineUsers: OnlineUsers = {}; // Mapping of email -> socketId

export const initSocket = (server: HttpServer): Server => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket: Socket) => {
        console.log('User connected:', socket.id);

        // Notify all users about the updated onlineUsers object
        const broadcastOnlineUsers = () => {
            io.emit('update_online_users', onlineUsers);
        };

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Use Object.entries with forEach to safely iterate and avoid explicit loops
            Object.entries(onlineUsers).forEach(([email, id]) => {
                if (id === socket.id) {
                    delete onlineUsers[email];
                    console.log(`User with email ${email} disconnected.`);
                }
            });

            // Broadcast updated onlineUsers after a user disconnects
            broadcastOnlineUsers();
        });

        socket.on('connect_user', (email: string) => {
            onlineUsers[email] = socket.id;
            console.log('🚀 ~ socket.on ~ onlineUsers:', onlineUsers);
            console.log(`User identified: ${email} -> Socket ID: ${socket.id}`);
            // Broadcast updated onlineUsers after a user connects
            broadcastOnlineUsers();
        });

        // send message
        socket.on(
            'sendMessage',
            async ({ chatId, content, senderId, type, receiverId, receiverEmail }: TMessage) => {
                console.log('🚀 ~ receiverEmail:', receiverEmail);
                try {
                    console.log('Received message:', content);
                    // Save the message to the database
                    const message = await prisma.message.create({
                        data: {
                            chatId,
                            senderId,
                            receiverId,
                            content,
                            type,
                        },
                    });

                    // Check if the receiver is online
                    const receiverSocketId = onlineUsers[receiverEmail as string];
                    console.log('🚀 ~ receiverSocketId:', receiverSocketId);

                    if (receiverSocketId) {
                        // Emit the message to the receiver
                        io.to(receiverSocketId).emit('receive_response', 'Message received');
                    } else {
                        console.log(`User ${receiverEmail} is offline`);
                        // You can implement additional offline notification logic here
                    }

                    // Always respond to the sender with the saved message
                    socket.emit('messageSent', message);
                } catch (error) {
                    console.error('Error sending message:', error);
                    socket.emit('error', { message: 'Error sending message' });
                }
            }
        );
        // send response to load files in the chat
        socket.on('file_uploaded', ({ receiverEmail }: { receiverEmail: string }) => {
            console.log('🚀 ~ receiverEmail:', receiverEmail);
            try {
                // Check if the receiver is online
                const receiverSocketId = onlineUsers[receiverEmail];
                console.log('🚀 ~ receiverSocketId:', receiverSocketId);

                if (receiverSocketId) {
                    // Emit the message to the receiver
                    io.to(receiverSocketId).emit('receive_response', 'File uploaded');
                } else {
                    console.log(`User ${receiverEmail} is offline`);
                    // You can implement additional offline notification logic here
                }
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Error sending file response' });
            }
        });

        // send response to load files in the chat
        socket.on('send_chat_created', ({ receiverEmail }: { receiverEmail: string }) => {
            console.log('🚀 ~ receiverEmail:', receiverEmail);
            try {
                // Check if the receiver is online
                const receiverSocketId = onlineUsers[receiverEmail];
                console.log('🚀 ~ receiverSocketId:', receiverSocketId);

                if (receiverSocketId) {
                    // Emit the message to the receiver
                    io.to(receiverSocketId).emit('receive_chat_created', 'new chat created');
                } else {
                    console.log(`User ${receiverEmail} is offline`);
                    // You can implement additional offline notification logic here
                }
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Error sending file response' });
            }
        });

        // send typing notification
        socket.on(
            'start_typing',
            ({ chatId, receiverEmail }: { chatId: string; receiverEmail: string }) => {
                console.log('🚀 ~ receiverEmail:', receiverEmail);
                try {
                    // Check if the receiver is online
                    const receiverSocketId = onlineUsers[receiverEmail];
                    console.log('🚀 ~ receiverSocketId:', receiverSocketId);

                    if (receiverSocketId) {
                        // Emit the message to the receiver
                        io.to(receiverSocketId).emit('receive_start_typing', {
                            chatId,
                            receiverEmail,
                        });
                    } else {
                        console.log(`User ${receiverEmail} is offline`);
                        // You can implement additional offline notification logic here
                    }
                } catch (error) {
                    console.error('Error sending message:', error);
                    socket.emit('error', { message: 'Error sending file response' });
                }
            }
        );

        // send typing stop status
        socket.on(
            'stop_typing',
            ({ chatId, receiverEmail }: { chatId: string; receiverEmail: string }) => {
                console.log('🚀 ~ receiverEmail:', receiverEmail);
                try {
                    // Check if the receiver is online
                    const receiverSocketId = onlineUsers[receiverEmail];
                    console.log('🚀 ~ receiverSocketId:', receiverSocketId);

                    if (receiverSocketId) {
                        // Emit the message to the receiver
                        io.to(receiverSocketId).emit('receive_stop_typing', {
                            chatId,
                            receiverEmail,
                        });
                    } else {
                        console.log(`User ${receiverEmail} is offline`);
                        // You can implement additional offline notification logic here
                    }
                } catch (error) {
                    console.error('Error sending message:', error);
                    socket.emit('error', { message: 'Error sending file response' });
                }
            }
        );
    });

    return io;
};

export const getSocketInstance = (): Server | undefined => io;
export const getOnlineUsers = (): { [email: string]: string } => onlineUsers;
