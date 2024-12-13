import { NextFunction, Request, Response } from 'express';

const catchAsync =
    (fn: (req: Request, res: Response) => Promise<void>) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res);
        } catch (error) {
            next(error);
        }
    };

export default catchAsync;
