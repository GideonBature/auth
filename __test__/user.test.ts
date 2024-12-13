import request from 'supertest';
import app from '../src/app';
import { prisma, resetDatabase } from '../src/shared';
import { configs } from '../src/shared/configs';

let server: any;
let cookies: any;

beforeEach(async () => {
    await resetDatabase();
    server = app.listen(configs.port);
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
        email: 'bofatac543@orsbap.com',
        password: 'Pass@123456',
    });

    console.log(loginResponse);

    cookies = loginResponse.headers['set-cookie'];
});

afterEach(async () => {
    await prisma.$disconnect();
    server.close();
});

it('Verify BVN', async () => {
    const bvnVerificationData = {
        bvn: '12345678901',
        gender: 'male',
        dateOfBirth: '1990-01-01',
    };

    const response = await request(app)
        .post('/api/v1/user/verify-bvn')
        .set('Cookie', cookies) // Reuses the stored cookies for this request
        .send(bvnVerificationData);

    expect(response.statusCode).toBe(200);
});

it('Add Card', async () => {
    const cardDetails = {
        cardNumber: '1234567812345678',
        expiryDate: '12/25',
        cardHolderName: 'John Doe',
        cvv: '123',
    };

    const response = await request(app)
        .post('/api/v1/user/add-card')
        .set('Cookie', cookies)
        .send(cardDetails);

    expect(response.statusCode).toBe(201);
});

it('Add Money Using Card', async () => {
    const cardDetails = {
        cardNumber: '1234567812345678',
        expiryDate: '12/25',
        cardHolderName: 'John Doe',
        cvv: '123',
    };

    const addCardResponse = await request(app)
        .post('/api/v1/user/add-card')
        .set('Cookie', cookies)
        .send(cardDetails);

    const cardId = addCardResponse.body.data.id;

    const moneyDetails = {
        amount: 1000,
    };

    const response = await request(app)
        .post(`/api/v1/user/add-money/${cardId}`)
        .set('Cookie', cookies)
        .send(moneyDetails);

    expect(response.statusCode).toBe(200);
});

it('Verify Identity', async () => {
    const idVerificationData = {
        documentType: 'voter_id',
        idNumber: 'A1234567',
        image: 'base64encodedImageString',
    };

    const response = await request(app)
        .post('/api/v1/user/verify-id')
        .set('Cookie', cookies)
        .send(idVerificationData);

    expect(response.statusCode).toBe(200);
});

it('Verify Address', async () => {
    const addressVerificationData = {
        address: '123 Main St',
        state: 'Lagos',
        localGovernment: 'Ikeja',
        city: 'Lagos',
        documentType: 'cable_bill',
        image: 'base64encodedImageString',
    };

    const response = await request(app)
        .post('/api/v1/user/verify-address')
        .set('Cookie', cookies)
        .send(addressVerificationData);

    expect(response.statusCode).toBe(200);
});

it('Add Next of Kin', async () => {
    const nextOfKinData = {
        firstName: 'Jane',
        lastName: 'Doe',
        gender: 'female',
        relationship: 'sister',
        phone: '+2348012345678',
        email: 'jane.doe@example.com',
        address: '123 Main St, Lagos',
    };

    const response = await request(app)
        .post('/api/v1/user/add-next-of-kin')
        .set('Cookie', cookies)
        .send(nextOfKinData);

    expect(response.statusCode).toBe(200);
});

it('Fail to Verify BVN with Missing Fields', async () => {
    const bvnVerificationData = {
        bvn: '12345678901',
        dateOfBirth: '1990-01-01',
    };

    const response = await request(app)
        .post('/api/v1/user/verify-bvn')
        .set('Cookie', cookies)
        .send(bvnVerificationData);

    expect(response.statusCode).toBe(400);
});

it('Fail to Verify Identity with Invalid Document Type', async () => {
    const idVerificationData = {
        documentType: 'invalid_doc',
        idNumber: 'A1234567',
        image: 'base64encodedImageString',
    };

    const response = await request(app)
        .post('/api/v1/user/verify-id')
        .set('Cookie', cookies)
        .send(idVerificationData);

    expect(response.statusCode).toBe(400);
});
