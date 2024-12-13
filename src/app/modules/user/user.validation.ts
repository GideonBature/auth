// import { AddressProofDocType } from '@prisma/client';
import { z } from 'zod';

export const updateUserInputZodSchema = z.object({
    body: z.object({
        fullName: z.string().trim().optional(),
        email: z.string().trim().email().optional(),
        phone: z.string().trim().optional(),
        address: z.string().trim().optional(),
        city: z.string().trim().optional(),
        state: z.string().trim().optional(),
        dateOfBirth: z.string().optional(), // date as string
        gender: z.string().trim().optional(),
        studentCategory: z.string().trim().optional(),
        universityAttended: z.string().trim().optional(),
        yearOfGraduation: z.string().trim().optional(),
        nigeriaLawSchoolCurrentlyAt: z.string().trim().optional(),
        level: z.string().trim().optional(),
        businessName: z.string().trim().optional(),
        businessDescription: z.string().trim().optional(),
        businessEmail: z.string().trim().optional(),
        businessSector: z.string().trim().optional(),
        businessAddress: z.string().trim().optional(),
        emailNotification: z.boolean().optional(),
        textNotification: z.boolean().optional(),
        description: z.string().optional(),
        keywords: z.string().optional(),
        lawServices: z.string().optional(),
    }),
});
