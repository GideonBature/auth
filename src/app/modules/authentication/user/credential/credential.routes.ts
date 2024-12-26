import { Router } from 'express';
import { asyncHandler, roleVerifier, zodValidator } from '../../../../../shared';
import { CredentialModules } from './credential.modules';
import {
    forgetPasswordOtpSendZodSchema,
    forgetPasswordZodSchema,
    gettingStartUserZodSchema,
    loginZodSchema,
    refreshTokenZodSchema,
    emailVerificationSchema,
    resetPasswordZodSchema,
    buyerInfoZodSchema,
    sellerInfoZodSchema,
} from './credential.validation';

const router = Router();
const credentialModules = new CredentialModules();
const {
    createPartialUser,
    emailVerification: createUser,
    loginUser,
    forgetPassword,
    forgetPasswordOtpSend,
    refreshAccessToken,
    changePassword,
    addBuyerInfo,
    addSellerInfo,
} = credentialModules.credentialControllers;

router.post(
    '/create-partial-user',
    zodValidator(gettingStartUserZodSchema),
    asyncHandler(createPartialUser.bind(credentialModules))
);
router.post(
    '/email-verification',
    zodValidator(emailVerificationSchema),
    asyncHandler(createUser.bind(credentialModules))
);
router.post(
    '/add-buyer-info',
    zodValidator(buyerInfoZodSchema),
    asyncHandler(addBuyerInfo.bind(credentialModules))
);
router.post(
    '/add-seller-info',
    zodValidator(sellerInfoZodSchema),
    asyncHandler(addSellerInfo.bind(credentialModules))
);
router.post(
    '/login',
    zodValidator(loginZodSchema),
    asyncHandler(loginUser.bind(credentialModules))
);
router.post(
    '/forget-password-otp-send',
    zodValidator(forgetPasswordOtpSendZodSchema),
    asyncHandler(forgetPasswordOtpSend.bind(credentialModules))
);
router.post(
    '/forget-password',
    zodValidator(forgetPasswordZodSchema),
    asyncHandler(forgetPassword.bind(credentialModules))
);
router.post(
    '/refresh-token',
    zodValidator(refreshTokenZodSchema),
    asyncHandler(refreshAccessToken.bind(credentialModules))
);
router.post(
    '/change-password',
    zodValidator(resetPasswordZodSchema),
    roleVerifier('lawStudent', 'business', 'lawyer'),
    asyncHandler(changePassword.bind(credentialModules))
);

// router.post(
//     '/verify-email',
//     zodValidator(verifyEmailZodSchema),
//     asyncHandler(verifyEmail.bind(credentialModules))
// );
// router.get(
//     '/logout',
//     zodValidator(refreshTokenZodSchema),
//     asyncHandler(logoutUser.bind(credentialModules))
// );

export const credentialRoutes = router;
