import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/;
// const phoneNumberRegex = /^(234|017|018|019|016|015|014|013)\d{8}$/;

export const gettingStartUserZodSchema = z.object({
    body: z
        .object({
            email: z
                .string({
                    required_error: 'Email is required',
                })
                .email({
                    message: 'Invalid email format.',
                })
                .trim(),

            phoneNumber: z
                .string({
                    required_error: 'Phone number is required',
                })
                .trim(),
            // .regex(phoneNumberRegex, 'Invalid phone number format.'),

            firstName: z
                .string({
                    required_error: 'first name is required',
                })
                .trim()
                .min(3, 'first Name too short - should be 3 chars minimum')
                .max(100, 'first Name too long - should be 100 chars maximum'),

            lastName: z
                .string({
                    required_error: 'last name is required',
                })
                .trim()
                .min(3, 'last Name too short - should be 3 chars minimum')
                .max(100, 'last Name too long - should be 100 chars maximum'),

            password: z
                .string({
                    required_error: 'Password is required',
                })
                .min(6, 'Password too short - should be 6 chars minimum')
                .max(100, 'Password too long - should be 100 chars maximum')
                .trim()
                .regex(
                    passwordRegex,
                    'Invalid password format. It must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
                ),

            confirmPassword: z.string({
                required_error: 'Confirm password is required',
            }),
        })
        .refine(
            (data) =>
                data.password && data.confirmPassword && data.password === data.confirmPassword,

            {
                message: 'Passwords do not match.',
                path: ['password', 'confirmPassword'],
            }
        ),
});

export const emailVerificationSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email({
                message: 'Invalid email format.',
            })
            .trim(),

        emailVerificationCode: z
            .string({
                required_error: 'code is required',
            })
            .trim(),
    }),
});

export const loginZodSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

export const refreshTokenZodSchema = z.object({
    headers: z.object({
        authorization: z.string({
            required_error: 'Refresh token is required',
        }),
    }),
});

// export const refreshTokenZodSchema = z.object({
//     cookies: z.object({
//         refreshToken: z.string({
//             required_error: 'Refresh token is required',
//         }),
//     }),
// });
export const verifyEmailZodSchema = z.object({
    // cookies: z.object({
    //     refreshToken: z.string({
    //         required_error: 'Refresh token is required',
    //     }),
    // }),
});

export const forgetPasswordZodSchema = z.object({
    body: z
        .object({
            email: z
                .string({
                    required_error: 'Email is required',
                })
                .email({
                    message: 'Invalid email format.',
                })
                .trim(),

            emailVerificationCode: z
                .string({
                    required_error: 'code is required',
                })
                .trim(),

            newPassword: z
                .string({
                    required_error: 'Password is required',
                })
                .min(8, 'Password too short - should be 6 chars minimum')
                .max(100, 'Password too long - should be 100 chars maximum')
                .trim()
                .regex(
                    passwordRegex,
                    'Invalid password format. It must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
                ),

            confirmNewPassword: z.string({
                required_error: 'Confirm password is required',
            }),
        })
        .refine(
            (data) =>
                data.newPassword &&
                data.confirmNewPassword &&
                data.newPassword === data.confirmNewPassword,

            {
                message: 'Passwords do not match.',
                path: ['password', 'confirmPassword'],
            }
        ),
});

export const forgetPasswordOtpSendZodSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email({
                message: 'Invalid email format.',
            })
            .trim(),
    }),
});

export const resetPasswordZodSchema = z.object({
    body: z
        .object({
            currentPassword: z.string({
                required_error: 'current password is required',
            }),

            newPassword: z
                .string({
                    required_error: 'Password is required',
                })
                .min(6, 'Password too short - should be 6 chars minimum')
                .max(100, 'Password too long - should be 100 chars maximum')
                .trim()
                .regex(
                    passwordRegex,
                    'Invalid password format. It must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
                ),

            confirmNewPassword: z.string({
                required_error: 'Confirm password is required',
            }),
        })
        .refine(
            (data) =>
                data.newPassword &&
                data.confirmNewPassword &&
                data.newPassword === data.confirmNewPassword,

            {
                message: 'Passwords do not match.',
                path: ['newPassword', 'confirmNewPassword'],
            }
        ),
});
