import request from 'supertest';
import func from '../src/server';

describe("testing post route", () => {

    afterAll(done => { 
        func.server.listening ? func.server.close(() => done()) : done();
    })

    test('should run', () => {
        expect(true).toBe(true);
    })

    test('testing get all posts request', async () => {
        const response = await request(func.app)
            .get('/api/posts');
        expect(response.status).toBe(200);
    });

    test('testing post created', async () => {
        const response = await request(func.app)
            .post('/api/posts')
            .send({
                title: 'Testing title',
                content: 'Testing content',
                author: {
                    username: "admin",
                    email: "admin@gmail.com",
                    password: "admin",
                    friends: [],
                    posts: [],
                    phone: "ADMIN PHONE",
                    address: "ADMIN ADDRESS",
                    bio: "ADMIN BIO"
                },
                image: 'https://pbs.twimg.com/profile_images/1323445943228755968/BZ4OTcXZ_400x400.jpg'
            })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('success')
    });
}) 