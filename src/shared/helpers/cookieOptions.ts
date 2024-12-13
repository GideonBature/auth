const cookieOptions = {
    secure: true,
    sameSite: 'none' as const,
    // secure: configs.env === 'production',
    httpOnly: true,
};

export { cookieOptions };
