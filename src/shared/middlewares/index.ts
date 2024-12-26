// export the app
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';

import path from 'path';

import helmet from 'helmet';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { corsConfigs, swaggerConfigs } from '../configs';
import { ln, logger } from '../utils';
import { requestLogger } from './requestLogger';

// apply middlewares

export const applyMiddleware = (app: Application) => {
    app.use(cookieParser());

    logger.warn('💥 server started ✨', { f: path.basename(__filename), l: ln() });

    app.use([
        cors(corsConfigs),
        cookieParser(),
        helmet(),
        express.static(path.join(__dirname, '../../../public')),
        express.json(),
        express.urlencoded({ extended: true }),
        requestLogger,
    ]);

    const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';

    const swaggerSpecs = swaggerJsdoc(swaggerConfigs.options);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, { customCssUrl: CSS_URL }));

    // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
    // app.get('/docs.json', (req: Request, res: Response) => {
    //     res.setHeader('Content-Type', 'application/json');
    //     res.send(swaggerSpecs);
    // });
};

// other middlewares
export { globalErrorHandler } from './globalErrorHandler';
export { requestLogger } from './requestLogger';
export { roleVerifier } from './roleVerifier';
export { zodValidator } from './zodValidator';
