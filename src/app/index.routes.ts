import express from 'express';
import { feedbackRoutes } from './modules/feedback/feedback.routes';
import { authRoutes } from './modules/authentication/user/auth/auth.routes';
import { userRoutes } from './modules/user/user.routes';
import { notificationRoutes } from './modules/notification/notification.routes';
import { searchRoutes } from './modules/search/search.routes';
import { chatRouters } from './modules/chat/chat.routes';

const routes = express.Router();

routes.get('/health', (req, res) => {
    res.send('OK');
});

const moduleRoutes = [
    {
        path: '/feedback',
        route: feedbackRoutes,
    },
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/user',
        route: userRoutes,
    },
    {
        path: '/notification',
        route: notificationRoutes,
    },
    {
        path: '/search',
        route: searchRoutes,
    },
    {
        path: '/chat',
        route: chatRouters,
    },
];

moduleRoutes.forEach((route) => routes.use(route.path, route.route));

export default routes;
