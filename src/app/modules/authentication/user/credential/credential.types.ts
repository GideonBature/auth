import { GettingStartedUser, Profile, User, UserRoles } from '@prisma/client';
import { UserRole } from '../../../../../shared';

export type TPartialUserRegisterInput = {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
};

export type TEmailVerification = {
    email: string;
    emailVerificationCode: string;
};

export type TSellerInfo = {
    email: string;
    address: string;
    city: string;
    state: string;
    dateOfBirth: string;
    gender: string;
};

export type TBuyerInfo = {
    email: string;
    address: string;
    city: string;
    state: string;
    dateOfBirth: string;
    gender: string;
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
    role?: UserRole;
};

export type TPartialUser = GettingStartedUser;

export type TUserWithProfile = User & {
    profile?: Profile | null;
};

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
