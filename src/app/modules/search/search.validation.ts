// import { AddressProofDocType } from '@prisma/client';
import { z } from 'zod';

export const searchInputZodSchema = z.object({
    query: z.object({ searchTerm: z.string().trim().optional() }),
});
