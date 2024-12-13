import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
    payload: Record<string, unknown>,
    secret: Secret,
    expireTime: string
): string => {
    return jwt.sign(payload, secret, {
        expiresIn: expireTime,
    });
};

// const verifyToken = (token: string, secret: Secret): JwtPayload => {
//     try {
//         return jwt.verify(token, secret) as JwtPayload;
//     } catch (error) {
//         if (error instanceof TokenExpiredError) {
//             throw new TokenExpiredError(error.message, error.expiredAt);
//         }
//         if (error instanceof JsonWebTokenError || error instanceof NotBeforeError) {
//             throw new JsonWebTokenError(error.message);
//         }
//         throw new HandleApiError(
//             errorNames.BAD_REQUEST,
//             httpStatus.BAD_REQUEST,
//             'Something happened in the token operation!'
//         );
//     }
// };

// const verifyToken = (token: string, secret: Secret): JwtPayload => {
//     jwt.verify(token, secret, (err, decoded) => {
//         if (err) {
//             if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
//                 throw new JsonWebTokenError(err.message);
//             } else if (err.name === 'TokenExpiredError') {
//                 throw new TokenExpiredError(err.message, new Date());
//             }
//         }
//         return decoded;
//     });
//     return {} as JwtPayload;
// };
const verifyToken = (token: string, secret: Secret): JwtPayload => {
    return jwt.verify(token, secret) as JwtPayload;
};
const verifyTokenWithError = (token: string, secret: Secret): JwtPayload => {
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return {
            err: null,
            decoded,
        };
    } catch (error) {
        return {
            err: error,
            decoded: null,
        };
    }
};

export const jwtHelpers = {
    createToken,
    verifyToken,
    verifyTokenWithError,
};
