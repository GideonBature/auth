import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { configs } from '../configs/env.configs';

const { combine, timestamp, label, printf, colorize } = format;
const { env } = configs;

// Custom Log Format
function ln() {
    const error = new Error();
    const stack = error.stack ? error.stack.split('\n') : [];
    if (stack.length > 2) {
        const match = stack[2].match(/:(\d+):(\d+)\)$/);
        if (match) {
            return parseInt(match[1]);
        }
    }
    return null;
}
const prodFormat = printf(({ level, message, label: _label, timestamp: _timestamp }) => {
    const date = new Date(_timestamp as Date);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `🌺Date: ${date.toDateString()} 🌺Time: ${hour}:${minutes}:${seconds} 👨Coder: [${
        _label as string
    }] 🌺Type: ${level} 
🔥Message: ${message as string}

`;
});

const devFormat = printf(({ level, message, label: _label, timestamp: _timestamp, f, l }) => {
    const date = new Date(_timestamp as Date);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const boldMessage = `\x1b[1m${message as string}\x1b[0m`;

    return `
  🌳🎄🌲🌴  🌳🎄🌲🌴  🌳🎄🌲🌴  🌳🎄🌲🌴
 
🌺 Date: ${date.toDateString()}
🌼 Time: ${hour}:${minutes}:${seconds}
👨 Coder: [${_label as string}]
🎆 Type: ${level}
🎊 Source: ${(f as string) || 'n/a'}:${(l as number) || 0}
-------------😍--------------- 
🐜 Message: ${boldMessage}

  🔥🔥🔥🔥  🔥🔥🔥🔥  🔥🔥🔥🔥  🔥🔥🔥🔥
`;
});

const selectFormat = () => (env === 'development' ? devFormat : prodFormat);

const isVercel = process.env.VERCEL === '1';

const loggerTransports = [];
const errorLoggerTransports = [];

if (env === 'development' || isVercel) {
    loggerTransports.push(
        new transports.Console({
            format: combine(colorize({ all: true })),
        })
    );
    errorLoggerTransports.push(
        new transports.Console({
            format: combine(colorize({ all: true })),
        })
    );
}

if (env === 'production' && !isVercel) {
    const successLogFilePath = path.join(
        process.cwd(),
        'logs',
        'winston',
        'successes',
        'HM-%DATE%-success.log'
    );
    const errorLogFilePath = path.join(
        process.cwd(),
        'logs',
        'winston',
        'errors',
        'HM-%DATE%-error.log'
    );

    const successLogTransport = new DailyRotateFile({
        filename: successLogFilePath,
        datePattern: 'YYYY-DD-MM-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
    });

    const errorLogTransport = new DailyRotateFile({
        filename: errorLogFilePath,
        datePattern: 'YYYY-DD-MM-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
    });

    loggerTransports.push(successLogTransport);
    errorLoggerTransports.push(errorLogTransport);
}

const logger = createLogger({
    level: 'silly',
    format: combine(label({ label: 'dev_reality' }), timestamp(), selectFormat()),
    transports: loggerTransports,
});

const errorLogger = createLogger({
    level: 'error',
    format: combine(label({ label: 'dev_reality' }), timestamp(), selectFormat()),
    transports: errorLoggerTransports,
});

export { errorLogger, ln, logger };
