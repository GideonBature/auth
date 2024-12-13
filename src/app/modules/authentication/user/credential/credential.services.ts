/* eslint-disable class-methods-use-this */
import { GettingStartedUser, User } from '@prisma/client';
import crypto from 'crypto';
import httpStatus from 'http-status';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import {
    HandleApiError,
    configs,
    errorNames,
    // exclude,
    jwtHelpers,
    prisma,
} from '../../../../../shared';
import { MailOptions, sendMail } from '../../../../../shared/mail/mailService';
import { CredentialSharedServices } from './credential.shared';
import {
    TEmailOtpSend,
    TForgetPasswordInput,
    TPartialUserRegisterInput,
    TResetPasswordInput,
    TUserLoginInput,
    TUserLoginResponse,
    TEmailVerification,
} from './credential.types';

const {
    findPartialUserByEmail,
    findUserByPhoneNumber,
    // findUserByToken,
    findUserByEmail,
    findUserById,
    updateUserByEmail,
    updateUserById,
} = CredentialSharedServices;

// encrypt password
const hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10);
};

export class CredentialServices {
    createPartialUser = async (
        user: TPartialUserRegisterInput
    ): Promise<GettingStartedUser | null> => {
        const userExists = await findUserByEmail(user.email);
        // const partialUser = await findPartialUserByEmail(user.email);

        if (userExists) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'user already exists!'
            );
        }

        const partialUserExists = await findPartialUserByEmail(user.email);
        if (
            partialUserExists &&
            (partialUserExists?.emailVerificationExpiresAt as Date) > new Date()
        ) {
            throw new HandleApiError(
                errorNames.BAD_REQUEST,
                httpStatus.BAD_REQUEST,
                'Please try again 5 min later!'
            );
        } else if (partialUserExists)
            await prisma.gettingStartedUser.delete({
                where: {
                    id: partialUserExists.id,
                },
            });

        const phoneNumberExists = await findUserByPhoneNumber(user.phoneNumber);

        if (phoneNumberExists) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'phone number already exists!'
            );
        }

        const code = crypto.randomInt(100000, 999999).toString();

        if (!code) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'Error while generating code!'
            );
        }

        const expirationTime = 5 * 60 * 1000; // 5 minutes

        const createdPartialUser = await prisma.gettingStartedUser.create({
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerificationCode: code,
                emailVerificationExpiresAt: new Date(Date.now() + expirationTime),
                phone: user.phoneNumber,
                password: user.password,
            },
        });
        console.log('🚀 ~ CredentialServices ~ createdPartialUser:', createdPartialUser);

        const mailOptions: MailOptions = {
            to: user.email,
            subject: 'Your OTP Code',
            template: 'sentOtp',
            context: {
                name: `${user.firstName} ${user.lastName}`,
                otp: code,
            },
        };

        try {
            await sendMail(mailOptions);
            console.log('Verification email sent successfully.');
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // Optionally, handle the error (e.g., clean up the user created in case of failure)
        }

        return createdPartialUser;
    };

    emailVerification = async (user: TEmailVerification): Promise<object | null> => {
        console.log('🌼 🔥🔥 CredentialServices 🔥🔥 createUser= 🔥🔥 user🌼', user);

        const partialUser = await findPartialUserByEmail(user.email);
        console.log('🌼 🔥🔥 CredentialServices 🔥🔥 createUser= 🔥🔥 partialUser🌼', partialUser);

        // user non existence check
        if (!partialUser) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'user already exists!'
            );
        }

        if (!user.emailVerificationCode || !partialUser?.emailVerificationCode) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'Verification code not found!'
            );
        }

        if ((partialUser?.emailVerificationExpiresAt as Date) < new Date()) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'Verification code has expired!'
            );
        }

        if (user.emailVerificationCode !== partialUser?.emailVerificationCode) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'Invalid email verification code'
            );
        }

        const verifiedPartialUser = await prisma.gettingStartedUser.update({
            where: {
                email: user.email,
            },
            data: {
                isVerified: true,
            },
        });
        return verifiedPartialUser;
    };

    loginUser = async (loginInput: TUserLoginInput): Promise<TUserLoginResponse | null> => {
        console.log('🚀 ~ CredentialServices ~ loginUser= ~ loginInput:', loginInput);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const userExists = await findUserByEmail(loginInput.email);
        console.log('🚀 ~ CredentialServices ~ loginUser= ~ userExists:', userExists);

        if (!userExists) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }
        // password validation check
        const isPasswordValid = await prisma.user.validatePassword(
            userExists.password as string,
            loginInput.password
        );

        if (!isPasswordValid) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'invalid email or password !'
            );
        }

        // const { isVerified } = userExists;

        // if (!isVerified) {
        //     throw new HandleApiError(
        //         errorNames.UNAUTHORIZED,
        //         httpStatus.UNAUTHORIZED,
        //         'Your account has not been verified'
        //     );
        // }

        const { email, firstName, lastName, id, profileImage } = userExists;
        const payloadData = {
            email,
            firstName,
            lastName,
            id,
            profileImage,
            iat: Math.floor(Date.now() / 1000),
        };
        const refreshTokenPayloadData = {
            email,
            iat: Math.floor(Date.now() / 1000),
        };
        const accessToken = jwtHelpers.createToken(
            payloadData,
            configs.jwtSecretAccess as string,
            configs.jwtSecretAccessExpired as string
        );

        const refreshToken = jwtHelpers.createToken(
            refreshTokenPayloadData,
            configs.jwtSecretRefresh as string,
            configs.jwtSecretRefreshExpired as string
        );

        // refresh token verification and save to db

        return { accessToken, refreshToken, userExists };
    };

    otpSend = async (input: TEmailOtpSend): Promise<Omit<User, 'password'> | null> => {
        const { email } = input;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        const code = crypto.randomInt(100000, 999999).toString();

        if (!code) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'Error while generating code!'
            );
        }

        const mailOptions: MailOptions = {
            to: email,
            subject: 'Your OTP Code',
            template: 'sentOtp',
            context: {
                name: `${user.firstName} ${user.lastName}`,
                otp: code,
            },
        };

        try {
            await sendMail(mailOptions);
            console.log('Verification email sent successfully.');
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // Optionally, handle the error (e.g., clean up the user created in case of failure)
        }

        const expirationTime = 5 * 60 * 1000; // 5 minutes

        const updatedUser = await updateUserByEmail(email, {
            emailVerificationCode: code,
            emailVerificationExpiresAt: new Date(Date.now() + expirationTime),
        });

        return updatedUser;
    };

    forgetPassword = async (
        input: TForgetPasswordInput
    ): Promise<Omit<User, 'password'> | null> => {
        const { confirmNewPassword, newPassword, email, emailVerificationCode } = input;

        if (newPassword !== confirmNewPassword) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'new password and confirm password must be same'
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        if (!user.emailVerificationCode) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'Verification code not found!'
            );
        }

        if ((user.emailVerificationExpiresAt as Date) < new Date()) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'Verification code has expired!'
            );
        }

        if (user.emailVerificationCode !== emailVerificationCode) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'Invalid email verification code'
            );
        }

        const updatedUser = await updateUserByEmail(email, { password: newPassword });

        return updatedUser;
    };

    changePassword = async (input: TResetPasswordInput, userID: string): Promise<object> => {
        console.log('🚀 ~ CredentialServices ~ changePassword= ~ input:', input);
        const { currentPassword, confirmNewPassword, newPassword } = input;

        if (newPassword !== confirmNewPassword) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'new passowrd and confirm password must be same'
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userID },
        });

        const isPassCorrect = await prisma.user.validatePassword(
            user?.password as string,
            currentPassword
        );

        if (!isPassCorrect) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'Old password is incorrect!'
            );
        }

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        const hashedPass = hashPassword(newPassword);

        const updatedUser = await updateUserById(userID, { password: hashedPass });
        console.log('🚀 ~ CredentialServices ~ changePassword= ~ updatedUser:', updatedUser);

        if (!updatedUser) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'failed to update password!'
            );
        }

        return {};
    };

    async refreshAccessToken(
        refreshToken: string
    ): Promise<Omit<TUserLoginResponse, 'userExists'> | void> {
        // console.log('🌼 🔥🔥 CredentialServices 🔥🔥 userExists🌼', userExists);
        const decodedData = jwtHelpers.verifyToken(
            refreshToken,
            configs.jwtSecretRefresh as string
        );
        // console.log('🌼 🔥🔥 CredentialServices 🔥🔥 decoded🌼', decoded);
        const userExists = await findUserByEmail(decodedData.email as string);

        // refresh token reuse detection
        if (!userExists) {
            // refresh token niye asce but db te nai

            if (decodedData) {
                const hackedUser = await findUserById(decodedData.id as string);
                if (hackedUser) {
                    hackedUser.refreshToken = [];
                    await hackedUser.save();
                }
            }
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'invalid token !'
            );
        }
        let newRefreshTokenArray = [] as string[] | [];
        if (userExists) {
            // refresh token niye asce and db teo ache

            // steps 1. existing refresh token array theke ei refresh token ta remove kore dibo
            newRefreshTokenArray = userExists.refreshToken.filter(
                (rt: string) => rt !== refreshToken
            );

            const verifyToken = jwtHelpers.verifyTokenWithError(
                refreshToken,
                configs.jwtSecretRefresh as string
            );
            if (verifyToken.err) {
                // refresh token expired
                await updateUserById(userExists.id, {
                    refreshToken: newRefreshTokenArray,
                });
                throw new JsonWebTokenError('refresh token expired. login again!');
            }
            if ((verifyToken.decoded as JwtPayload)?.email !== userExists.email) {
                throw new HandleApiError(
                    errorNames.UNAUTHORIZED,
                    httpStatus.UNAUTHORIZED,
                    'something wrong with token!'
                );
            }

            // refresh token valid
            const { email, firstName, lastName, profileImage, id } = userExists;
            const payloadData = {
                email,
                firstName,
                lastName,
                id,
                profileImage,

                iat: Math.floor(Date.now() / 1000),
            };
            const refreshTokenPayloadData = {
                email,
                iat: Math.floor(Date.now() / 1000),
            };
            const accessToken = jwtHelpers.createToken(
                payloadData,
                configs.jwtSecretAccess as string,
                configs.jwtSecretAccessExpired as string
            );

            const newRefreshToken = jwtHelpers.createToken(
                refreshTokenPayloadData,
                configs.jwtSecretRefresh as string,
                configs.jwtSecretRefreshExpired as string
            );

            await updateUserById(userExists.id, {
                refreshToken: [...newRefreshTokenArray, newRefreshToken],
            });
            return { accessToken, refreshToken: newRefreshToken };
        }
    }

    // async logoutUser(refreshToken: string): Promise<void> {
    //     const userExists = await findUserByToken(refreshToken);
    //     if (!userExists) {
    //         throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'user not found!');
    //     }
    //     const newRefreshTokenArray = userExists.refreshToken.filter((rt) => rt !== refreshToken);
    //     await updateUserById(userExists.id, {
    //         refreshToken: newRefreshTokenArray,
    //     });
    // }

    // async verifyEmail(token: string): Promise<void> {
    //     const userExists = await findUserByToken(token);
    //     if (!userExists) {
    //         throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'user not found!');
    //     }
    //     if (userExists.isVerified) {
    //         throw new HandleApiError(
    //             errorNames.CONFLICT,
    //             httpStatus.CONFLICT,
    //             'user already verified!'
    //         );
    //     }
    //     await updateUserById(userExists.id, {
    //         isVerified: true,
    //     });
    // }
}
