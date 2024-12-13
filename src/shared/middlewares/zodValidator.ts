/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

export const 
zodValidator =
    (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
                headers: req.headers,
            });
            return next();
        } catch (error) {
            next(error);
        }
    };
