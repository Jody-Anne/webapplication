const request = require('supertest');
const app = require('./app');

describe('Test the API endpoints', () => {
  it('should get the list of favourites', async () => {
    const response = await request(app).get('/favourites');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should add a favourite', async () => {
    const response = await request(app)
      .post('/favourites')
      .send({ id: '123', name: 'song name', artist: 'artist name' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: '123', name: 'song name', artist: 'artist name' }]);
  });

  it('should not add a duplicate favourite', async () => {
    const response = await request(app)
      .post('/favourites')
      .send({ id: '123', name: 'song name', artist: 'artist name' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: '123', name: 'song name', artist: 'artist name' }]);
  });

  it('should delete a favourite', async () => {
    const response = await request(app).delete('/favourites/123');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should search for songs on iTunes', async () => {
    const response = await request(app).get('/search?q=hello');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(10);
  });
});
