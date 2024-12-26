// import { AddressProofDocType } from '@prisma/client';
import { z } from 'zod';

export const updateUserInputZodSchema = z.object({
    body: z.object({
        firstName: z.string().trim().optional(),
        lastName: z.string().trim().optional(),
        email: z.string().trim().email().optional(),
        phone: z.string().trim().optional(),
        address: z.string().trim().optional(),
        city: z.string().trim().optional(),
        state: z.string().trim().optional(),
        dateOfBirth: z.string().optional(), // date as string
        gender: z.string().trim().optional(),
        emailNotification: z.boolean().optional(),
        textNotification: z.boolean().optional(),
    }),
});
