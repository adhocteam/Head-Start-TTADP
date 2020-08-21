import request from 'supertest';
import server from './index';

describe('Root', () => {
  test('Successfully returns the page', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Hello');
  });
  afterAll(async () => {
    await server.close();
  });
});
