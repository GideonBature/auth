import colors from '@colors/colors';

import http from 'http';
import app from './app';

import { configs } from './shared/configs';
import { errorLogger, logger } from './shared/utils/logger';

import { initSocket } from './shared/socket/socket.config';

// Handle uncaughtException
process.on('uncaughtException', (error) => {
    console.log('uncaughtException detected.😞 '.red);
    errorLogger.error(error);
    process.exit(1);
});

const server = http.createServer(app);
initSocket(server);

const startServer = () => {
    try {
        // await connect();

        server.listen(configs.port, () => {
            console.log(
                colors.yellow(`Express server is running on port ${configs.port as string} 🚀
      
      `).bold
            );
        });
    } catch (err) {
        errorLogger.error('Failed to connect database', err);
    }
    // Handle unhandledRejection

    process.on('unhandledRejection', (error) => {
        console.log('unhandledRejection detected. closing server...'.red);
        if (server) {
            console.log('server is closed.😞 '.red);

            errorLogger.error(error);
            process.exit(1);
        } else {
            console.log('server is closed.😞 '.red);
            process.exit(1);
        }
    });
};
startServer();

process.on('SIGTERM', () => {
    logger.info('SIGTERM is received.😞');
    if (server) {
        server.close();
    }
});

// test commit for aminul/pm
