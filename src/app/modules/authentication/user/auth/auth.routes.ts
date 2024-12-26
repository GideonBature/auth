import express from 'express';
import { credentialRoutes } from '../credential/credential.routes';

// import { GoogleAuthRoutes } from './google/google.auth.route';

const AuthRoutes = express.Router();

const moduleRoutes = [
    {
        path: '/',
        route: credentialRoutes,
    },

    //   {
    //     path: '/provider',
    //     route: providerRoutes,
    //   },
];

moduleRoutes.forEach((route) => AuthRoutes.use(route.path, route.route));
// AuthRoutes.get('/me', roleVerifier(OWNER, READER, ADMIN), AuthControllers.loggedInUser);
// AuthRoutes.post('/logout', AuthControllers.logOut);
// AuthRoutes.get('/refresh', AuthControllers.refreshAccessToken);

export const authRoutes = AuthRoutes;
