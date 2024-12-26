import { Router } from 'express';
import { roleVerifier, zodValidator } from '../../../shared';
import { asyncHandler } from '../../../shared/helpers/asyncHandler';
import { UserModules } from './user.modules';
import { updateUserInputZodSchema } from './user.validation';

const router = Router();
const userModules = new UserModules();
const { updateUserProfile, getUserProfile } = userModules.userControllers;

router.get(
    '/get-user-profile',
    roleVerifier('business', 'lawyer', 'lawStudent'), // Add role verification middleware as needed
    asyncHandler(getUserProfile.bind(userModules))
);

router.patch(
    '/update-user-profile',
    zodValidator(updateUserInputZodSchema),
    roleVerifier('business', 'lawyer', 'lawStudent'), // Add role verification middleware as needed
    asyncHandler(updateUserProfile.bind(userModules))
);

export const userRoutes = router;
