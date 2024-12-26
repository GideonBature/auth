/* eslint-disable class-methods-use-this */
import httpStatus from 'http-status';
import { errorNames, HandleApiError, prisma } from '../../../shared';
import { TUpdateUserProfileInput } from './user.types';

export class UserServices {
    async getUserProfile(userId: string): Promise<object> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                profile: {
                    select: {
                        address: true,
                        city: true,
                        state: true,
                        dateOfBirth: true,
                        gender: true,
                    },
                },
            },
        });

        if (!user) {
            throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'User not found!');
        }

        return user;
    }

    async updateUserProfile(userId: string, input: TUpdateUserProfileInput): Promise<object> {
        const {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            dateOfBirth,
            gender,
            emailNotification,
            textNotification,
        } = input;
        console.log('🚀 ~ SearchServices ~ updateUserProfile ~ input:', input);

        // Update the User fields if any are provided in input
        if (firstName || lastName || email || phone || emailNotification || textNotification) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    ...(firstName && { firstName }),
                    ...(lastName && { lastName }),
                    ...(email && { email }),
                    ...(phone && { phone }),
                    ...(emailNotification && { emailNotification }),
                    ...(textNotification && { textNotification }),
                },
            });
        }

        // Fetch existing Profile associated with the User
        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        // Prepare Profile data based on input
        const profileData = {
            ...(address && { address }),
            ...(city && { city }),
            ...(state && { state }),
            ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
            ...(gender && { gender }),
        };

        // Update or create Profile based on whether it already exists
        if (Object.keys(profileData).length > 0) {
            if (profile) {
                await prisma.profile.update({
                    where: { userId },
                    data: profileData,
                });
            } else {
                await prisma.profile.create({
                    data: {
                        ...profileData,
                        user: {
                            connect: { id: userId },
                        },
                    },
                });
            }
        }

        const seller = await prisma.seller.findUnique({
            where: { userId },
        });

        // Prepare lawyer data based on input
        // const sellerData = {
        //     ...(description && { description }),
        //     ...(keywords && { keywords }),
        //     ...(lawServices && { lawServices }),
        // };

        // Update or create Lawyer based on whether it already exists
        // if (Object.keys(lawyerData).length > 0) {
        //     if (lawyer) {
        //         const hello = await prisma.lawyer.update({
        //             where: { userId },
        //             data: lawyerData,
        //         });
        //         console.log('🚀 ~ SearchServices ~ updateUserProfile ~ hello:', hello);
        //     } else {
        //         const afdasdf = await prisma.lawyer.create({
        //             data: {
        //                 ...lawyerData,
        //                 user: {
        //                     connect: { id: userId },
        //                 },
        //             },
        //         });
        //         console.log('🚀 ~ SearchServices ~ updateUserProfile ~ afdasdf:', afdasdf);
        //     }
        // }

        return {};
    }
}
