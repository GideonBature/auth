class HandleApiError extends Error {
    statusCode: number;

    error: string;

    constructor(err: string, statusCode: number, message: string | undefined, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.error = err;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { HandleApiError };
