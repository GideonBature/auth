import { GettingStartedUser, User } from '@prisma/client';
// import { UserRole } from '../../../../../shared';

export type TPartialUserRegisterInput = {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
};

export type TEmailVerification = {
    email: string;
    emailVerificationCode: string;
};

export type TForgetPasswordInput = {
    email: string;
    emailVerificationCode: string;
    newPassword: string;
    confirmNewPassword: string;
};

export type TResetPasswordInput = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

export type TEmailOtpSend = {
    email: string;
};

export type TUserLoginInput = {
    email: string;
    password: string;
};

export type TPartialUser = GettingStartedUser;

export type TUser = User;

export type TUserLoginResponse = {
    userExists: User;
    accessToken: string;
    refreshToken: string;
};

export type TCookies = {
    refreshToken: string;
    accessToken?: string;
};

export type TAccessToken = {
    accessToken: string;
};

export type TRefreshToken = {
    refreshToken: string;
};

export type TTokens = TAccessToken & TRefreshToken;
