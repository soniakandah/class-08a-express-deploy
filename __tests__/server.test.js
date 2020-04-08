'use strict';

const app = require('../lib/server.js');
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(app.server);

describe('fruits routes work', () => {
    it('can get fruits', async () => {
        let response = await mockRequest.get('/fruits');

        expect(JSON.stringify(response.body)).toBe(
            JSON.stringify([
                {
                    id: 1,
                    name: 'apple',
                    count: 20,
                },
                {
                    id: 2,
                    name: 'pear',
                    count: 14,
                },
                {
                    name: 'orange',
                    count: 9,
                    id: 3,
                },
            ]),
        );

        expect(response.status).toBe(200);
    });

    it('can update a fruit', async () => {
        let newFruitData = {
            name: 'apple',
            count: 25,
        };

        let response = await mockRequest.put('/fruits/1').send(newFruitData);

        expect(JSON.stringify(response.body)).toBe(
            JSON.stringify({ name: 'apple', count: 25, id: 1 }),
        );

        expect(response.status).toBe(200);
    });
});

describe('middleware works', () => {
    it("gives 404 error when accessing route that doesn't exist", async () => {
        let response = await mockRequest.post('/blah');
        expect(response.status).toBe(404);
    });
});
