import React, { useState } from 'react';
import axios from 'axios';
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/favorites', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const favoriteSchema = new mongoose.Schema({
  name: String,
  artist: String,
  id: Number
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

app.post('/favorites', async (req, res) => {
  const favorite = new Favorite(req.body);
  try {
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const express = require('express');
const app = express();
const axios = require('axios');

app.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const result = await axios.get(`https://itunes.apple.com/search?term=${q}`);
    res.json(result.data.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.get(`/search?q=${query}`);
    setResults(res.data);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      <div>
        {results.map(result => (
          <div key={result.id}>
            <h2>{result.name}</h2>
            <p>{result.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
