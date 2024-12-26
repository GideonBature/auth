import { configs } from './env.configs';

type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];
const whitelist: StaticOrigin = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:8080',
    'http://localhost:3000',
    configs.clientUrl as string,
];

// Define the type for the origin callback function
type OriginCallback = (err: Error | null, allow?: boolean) => void;

// Define the type for the corsOptions object
export const corsConfigs: {
    origin: (origin: string | undefined, callback: OriginCallback) => void;
    methods?: string | string[] | undefined;
    credentials: boolean;
    optionsSuccessStatus: number;
    allowedHeaders: string;
} = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin || '') !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Origin provided in backend mismatched. Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE, PATCH', // Add allowed methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With', // Add allowed headers,
    optionsSuccessStatus: 200,
};
