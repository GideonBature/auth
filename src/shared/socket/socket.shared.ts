// import { prisma } from '../index';

// export const saveChat = async (userId, userEmail, message, adminId) => {
//     return await prisma.chat.create({
//         data: {
//             userId,
//             userEmail,
//             message,
//             adminId,
//         },
//     });
// };

// export const getChatsByUser = async (userEmail) => {
//     return await prisma.chat.findMany({
//         where: {
//             userEmail,
//         },
//         orderBy: {
//             createdAt: 'asc',
//         },
//     });
// };

// export const saveNotification = async (userId, userEmail, message) => {
//     return await prisma.notification.create({
//       data: {
//         userId,
//         userEmail,
//         message,
//       },
//     });
//   };

//   export const getNotificationsByUser = async (userEmail) => {
//     return await prisma.notification.findMany({
//       where: {
//         userEmail,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//   };
