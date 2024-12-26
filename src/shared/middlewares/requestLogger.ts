import colors from '@colors/colors';
import { NextFunction, Request, Response } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(
        colors.bgCyan.black(
            `
Req-method:${req.method} - Req-url:${req.url} - Req-origin:${
                req.headers.origin || 'server origin'
            } - Time-of-req: ${new Date().toLocaleTimeString().underline}`
        )
    );
    next();
};
