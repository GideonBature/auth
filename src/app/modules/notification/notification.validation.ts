import { z } from 'zod';

export const notificationInputZodSchema = z.object({
    query: z.object({
        userId: z
            .string({ required_error: 'userId is required' })
            .uuid({ message: 'Invalid userId format' })
            .trim(),
    }),
});
