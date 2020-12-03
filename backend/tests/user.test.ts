import request from 'supertest';
import func from '../src/server';

describe("testing user route", () => {

    afterAll(done => { 
        func.server.listening ? func.server.close(() => done()) : done();
    })

    test('should run', () => {
        expect(true).toBe(true);
    })

    test('testing get all users request', async () => {
        const response = await request(func.app)
            .get('/api/users');
        expect(response.status).toBe(200);
    });

    test('testing user register', async () => {
        const response = await request(func.app)
            .post('/api/users/register')
            .send({
                username: 'Alisa',
                email: 'alisa@gmail.com',
                password: '123456'
            })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('success')
    });

}) 