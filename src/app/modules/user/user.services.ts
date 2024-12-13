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
                fullName: true,
                email: true,
                phone: true,
                profile: {
                    select: {
                        address: true,
                        city: true,
                        state: true,
                        dateOfBirth: true,
                        gender: true,
                        studentCategory: true,
                        universityAttended: true,
                        yearOfGraduation: true,
                        nigeriaLawSchoolCurrentlyAt: true,
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
            fullName,
            email,
            phone,
            address,
            city,
            state,
            dateOfBirth,
            gender,
            studentCategory,
            universityAttended,
            yearOfGraduation,
            nigeriaLawSchoolCurrentlyAt,
            level,
            businessName,
            businessDescription,
            businessEmail,
            businessSector,
            businessAddress,
            emailNotification,
            textNotification,
            description,
            keywords,
            lawServices,
        } = input;
        console.log('🚀 ~ SearchServices ~ updateUserProfile ~ input:', input);

        // Update the User fields if any are provided in input
        if (fullName || email || phone || emailNotification || textNotification) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    ...(fullName && { fullName }),
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
            ...(studentCategory && { studentCategory }),
            ...(universityAttended && { universityAttended }),
            ...(yearOfGraduation && { yearOfGraduation }),
            ...(nigeriaLawSchoolCurrentlyAt && { nigeriaLawSchoolCurrentlyAt }),
            ...(level && { level }),
            ...(businessName && { businessName }),
            ...(businessDescription && { businessDescription }),
            ...(businessEmail && { businessEmail }),
            ...(businessSector && { businessSector }),
            ...(businessAddress && { businessAddress }),
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

        const lawyer = await prisma.lawyer.findUnique({
            where: { userId },
        });

        // Prepare lawyer data based on input
        const lawyerData = {
            ...(description && { description }),
            ...(keywords && { keywords }),
            ...(lawServices && { lawServices }),
        };

        // Update or create Lawyer based on whether it already exists
        if (Object.keys(lawyerData).length > 0) {
            if (lawyer) {
                const hello = await prisma.lawyer.update({
                    where: { userId },
                    data: lawyerData,
                });
                console.log('🚀 ~ SearchServices ~ updateUserProfile ~ hello:', hello);
            } else {
                const afdasdf = await prisma.lawyer.create({
                    data: {
                        ...lawyerData,
                        user: {
                            connect: { id: userId },
                        },
                    },
                });
                console.log('🚀 ~ SearchServices ~ updateUserProfile ~ afdasdf:', afdasdf);
            }
        }

        return {};
    }
}
