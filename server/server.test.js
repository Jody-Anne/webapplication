const request = require('supertest');
const app = require("./App");
const fs = require("fs")
const axios = require("axios");

jest.mock("axios");
jest.mock('fs');

const MOCK_FAV_1 = {
  id: "fav1",
  name: "fav1_name",
  artist: "fav1_artist"
}

const MOCK_FAV_2 = {
  id: "fav2",
  name: "fav2_name",
  artist: "fav2_artist"
}

describe('Test the API endpoints', () => {
  beforeEach(() => {
    fs.readFileSync.mockReturnValue(JSON.stringify([MOCK_FAV_1, MOCK_FAV_2]));
  })

  it('should get the list of favourites', async () => {
    const response = await request(app).get('/favourites');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([MOCK_FAV_1, MOCK_FAV_2]);
  });

  it('should add a favourite', async () => {
    const response = await request(app)
      .post('/favourites')
      .send({ id: '123', name: 'song name', artist: 'artist name' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([MOCK_FAV_1, MOCK_FAV_2, { id: '123', name: 'song name', artist: 'artist name' }]);
  });

  it('should not add a duplicate favourite', async () => {
    const response = await request(app)
      .post('/favourites')
      .send(MOCK_FAV_1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([MOCK_FAV_1, MOCK_FAV_2]);
  });

  it('should delete a favourite', async () => {
    const response = await request(app).delete('/favourites/fav2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([MOCK_FAV_1]);
  });

  it('should search for songs on iTunes', async () => {
    axios.get.mockResolvedValueOnce({data: { results: ['a test']}});
    const response = await request(app).get('/search?q=hello');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(['a test']);
    expect(response.body.length).toBe(1);
  });
});
