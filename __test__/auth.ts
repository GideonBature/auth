import request from 'supertest';
import app from '../src/app';
import { prisma, resetDatabase } from '../src/shared';
import { configs } from '../src/shared/configs';
import httpStatus from 'http-status';

// jest.mock('crypto');

let server: any;
beforeEach(async () => {
    await resetDatabase();
    server = app.listen(configs.port);
});

afterEach(async () => {
    await prisma.$disconnect();
    server.close();
});

const testUser = {
    email: 'bofatac543@orsbap.com',
    phoneNumber: '01412345678',
    firstName: 'Atharva',
    middleName: 'Pramod',
    lastName: 'Kohapare',
};

it('Health Check', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
});

it('Create Partial User', async () => {
    const response = await request(app).post('/api/v1/auth/create-partial-user').send(testUser);

    expect(response.statusCode).toBe(201);
});

it('Create User with Invalid Verification Code', async () => {
    await request(app).post('/api/v1/auth/create-partial-user').send(testUser);

    // const user = await prisma.gettingStartedUser.findUnique({
    //     where: {
    //         email: testUser.email,
    //     }
    // });

    // const verificationCode = user?.emailVerificationCode as string;

    const newUser = {
        email: 'bofatac543@orsbap.com',
        password: 'Pass@123456',
        confirmPassword: 'Pass@123456',
        emailVerificationCode: '000000',
        customerType: 'personal',
    };

    const response = await request(app).post('/api/v1/auth/register').send(newUser);

    expect(response.statusCode).toBe(409);
    expect(response.body.errorName).toBe('Invalid email verification code');
});

it('Create User', async () => {
    await request(app).post('/api/v1/auth/create-partial-user').send(testUser);

    const user = await prisma.gettingStartedUser.findUnique({
        where: {
            email: testUser.email,
        },
    });

    const verificationCode = user?.emailVerificationCode as string;

    const newUser = {
        email: 'bofatac543@orsbap.com',
        password: 'Pass@123456',
        confirmPassword: 'Pass@123456',
        emailVerificationCode: verificationCode,
        customerType: 'personal',
    };

    const response = await request(app).post('/api/v1/auth/register').send(newUser);

    expect(response.statusCode).toBe(201);
});

it('Login User', async () => {
    await request(app).post('/api/v1/auth/create-partial-user').send(testUser);

    const user = await prisma.gettingStartedUser.findUnique({
        where: {
            email: testUser.email,
        },
    });

    const verificationCode = user?.emailVerificationCode as string;

    await request(app).post('/api/v1/auth/create-user').send({
        email: 'bofatac543@orsbap.com',
        password: 'Pass@123456',
        confirmPassword: 'Pass@123456',
        emailVerificationCode: verificationCode,
        customerType: 'personal',
    });

    const response = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: 'Pass@123456',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');

    const { data } = response.body;
    expect(data).toHaveProperty('accessToken');
    expect(data).toHaveProperty('refreshToken');
}, 10000);

it('login with empty email', async () => {
    await request(app).post('/api/v1/auth/create-partial-user').send(testUser);

    const user = await prisma.gettingStartedUser.findUnique({
        where: {
            email: testUser.email,
        },
    });

    const verificationCode = user?.emailVerificationCode as string;

    await request(app).post('/api/v1/auth/create-user').send({
        email: 'bofatac543@orsbap.com',
        password: 'Pass@123456',
        confirmPassword: 'Pass@123456',
        emailVerificationCode: verificationCode,
        customerType: 'personal',
    });

    const response = await request(app).post('/api/v1/auth/login').send({
        email: '',
        password: 'Pass@123456',
    });

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
});

it('Login User with Wrong Password', async () => {
    await request(app).post('/api/v1/auth/create-partial-user').send(testUser);

    const user = await prisma.gettingStartedUser.findUnique({
        where: {
            email: testUser.email,
        },
    });

    const verificationCode = user?.emailVerificationCode as string;

    await request(app).post('/api/v1/auth/create-user').send({
        email: 'bofatac543@orsbap.com',
        password: 'Pass@123456',
        confirmPassword: 'Pass@123456',
        emailVerificationCode: verificationCode,
        customerType: 'personal',
    });

    const response = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: 'Pass@123456455',
    });

    console.log('response', response.body);

    expect(response.statusCode).toBe(401);
    expect(response.body.errorName).toBe('invalid email or password !');
}, 10000);

it('Forget Password', async () => {
    // await request(app).post('/api/v1/auth/create-partial-user').send(testUser);

    // const user = await prisma.gettingStartedUser.findUnique({
    //     where: {
    //         email: testUser.email,
    //     },
    // });

    // const verificationCode = user?.emailVerificationCode as string;

    // await request(app).post('/api/v1/auth/create-user').send({
    //     email: testUser.email,
    //     password: 'Pass@123456',
    //     confirmPassword: 'Pass@123456',
    //     emailVerificationCode: verificationCode,
    //     customerType: 'personal',
    // });

    await request(app).post('/api/v1/auth/forget-password-otp-send').send({
        email: testUser.email,
    });

    const forgetUser = await prisma.user.findUnique({
        where: {
            email: testUser.email,
        },
    });

    const forgetUserOtp = forgetUser?.emailVerificationCode;

    const response = await request(app).post(`/api/v1/auth/forget-password`).send({
        email: testUser.email,
        emailVerificationCode: forgetUserOtp,
        newPassword: 'Pass@123456',
        confirmNewPassword: 'Pass@123456',
    });

    expect(response.statusCode).toBe(200);
});
