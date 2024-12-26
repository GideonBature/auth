export const configs = {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    clientUrl: process.env.CLIENT,
    databaseUrl: process.env.DATABASE_URL,
    //* jwt
    jwtSecretAccess: process.env.JWT_SECRET_ACCESS_TOKEN,
    jwtSecretRefresh: process.env.JWT_SECRET_REFRESH_TOKEN,
    jwtSecretAccessExpired: process.env.JWT_SECRET_ACCESS_TOKEN_EXPIRED,
    jwtSecretRefreshExpired: process.env.JWT_SECRET_REFRESH_TOKEN_EXPIRED,
    saltRounds: process.env.SALT_ROUNDS,
    //* google auth
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleLoginCallback: process.env.GOOGLE_LOGIN_CALLBACK,
    //* google Playground Token
    googlePlaygroundRedirect: process.env.GOOGLE_PLAYGROUND_REDIRECT,
    googlePlaygroundRefresh: process.env.GOOGLE_PLAYGROUND_REFRESH_TOKEN,

    //* nodemailer secrets
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT,
    mailServiceProvider: process.env.MAIL_SERVICE_PROVIDER,
    mailIgnoreTls: process.env.MAIL_IGNORE_TLS,
    mailsecure: process.env.MAIL_SECURE,
    mailRequireTls: process.env.MAIL_REQUIRE_TLS,
    senderEmail: process.env.MAIL_USER,
    senderPass: process.env.MAIL_PASSWORD,

    node_env: process.env.NODE_ENV,

    //* Bank Api
    bankUrl: process.env.BANK_URL,
    clientId: process.env.CLIENT_ID,
    XAuthSignature: process.env.X_AUTH_SIGNATURE,
    bankUtilityBillUrl: process.env.BANK_UTILITY_BILL,
    M_KEY_ID: process.env.KEY_ID,
    M_APP_KEY: process.env.APP_KEY,
    M_BUCKET_ID: process.env.BUCKET_ID,
    M_DOWNLOAD_PREFIX: process.env.DOWNLOAD_PREFIX,
};
