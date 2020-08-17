import request from 'supertest';
import app from './app';

describe('Root', () => {
  test('Returns a 200', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
  });
});
