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

    test('testing upload image', async () => {
        const response = await request(func.app)
            .post(`/api/users/uploadAvatar/${2}`)
            .send({
                image: 'https://pbs.twimg.com/profile_images/1323445943228755968/BZ4OTcXZ_400x400.jpg'
            })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("success")
    })

}) 