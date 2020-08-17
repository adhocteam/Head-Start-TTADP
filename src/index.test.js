import request from 'supertest';
import server from './index';

describe('Root', () => {
  test('Returns a 200', async () => {
    const response = await request(server).get('/')
      .expect('Content-Type', 'text/html; charset=utf-8');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Hello');
  });
  afterAll(async () => {
    await server.close();
  });
});
