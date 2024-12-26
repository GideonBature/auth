import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import path from 'path';
import routes from './app/index.routes';
import { applyMiddleware, globalErrorHandler } from './shared/middlewares';

const app: Application = express();

//# apply middlewares
applyMiddleware(app);

//# route base
// home route
app.get('^/$|/index(.html)?', (_req, res) => {
    res.sendFile(path.join(__dirname, './shared/views', 'index.html'));
});

// business routes
app.use('/api/v1', routes);

//# error handler
// global error handler
app.use(globalErrorHandler);
// wrong path error route
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        error: 'Not Found',
        status: httpStatus.NOT_FOUND,
        message: 'Requested resource not found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: '404! Url doest not exist',
            },
        ],
    });
    next();
});

export default app;
