import { z } from 'zod';

export const feedbackInputZodSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email({
                message: 'Invalid email format.',
            })
            .trim(),

        name: z.string({
            required_error: 'name is required',
        }),

        message: z
            .string({
                required_error: 'name is required',
            })
            .trim(),
    }),
});
