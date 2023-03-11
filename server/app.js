const express = require('express');
const helmet = require('helmet'); // add this line
const cors = require('cors')
const fs = require('fs');
const axios = require('axios');

const DATASTORE_PATH = './datastore';
const DATASTORE = `${DATASTORE_PATH}/favourites-db.json`;

const initDatastore = () => {
  fs.mkdir(DATASTORE_PATH, { recursive: true }, (err) => {
    if (err) throw err;
  });
  if (!fs.existsSync(DATASTORE)) {
    fs.writeFileSync(DATASTORE, JSON.stringify([]));
  }
}

const readData = () => {
  initDatastore();
  const data = fs.readFileSync(DATASTORE, { encoding: 'utf-8' });
  return JSON.parse(data);
}

const writeData = (dataArr) => {
  initDatastore();
  fs.writeFileSync(DATASTORE, JSON.stringify(dataArr));
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet()); // add this line

app.get('/favourites/', (req, res) => {
  const favouriteList = readData();
  res.send(favouriteList)
})

app.post('/favourites/', (req, res) => {
  const favouriteList = readData();
  const favouriteExists = favouriteList.find((favourite) => favourite.id === req.body.id.toString())
  if (!favouriteExists) {
    favouriteList.push({
      id: req.body.id.toString(),
      name: req.body.name,
      artist: req.body.artist,
    })
    writeData(favouriteList);
  }
  res.send(favouriteList)
})

app.delete('/favourites/:id', (req, res) => {
  const favouriteList = readData();
  const newFavouriteList = favouriteList.filter(favourite => favourite.id !== req.params.id);
  writeData(newFavouriteList)
  res.send(newFavouriteList)
})

app.get('/search', async (req, res) => {
  const { q, media } = req.query;
  const result = await axios.get(`https://itunes.apple.com/search?term=${q}&media=${media}&limit=10`);

  console.log(result)

  res.json(result.data.results);
});

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send('Something broke!')
})

module.exports = app;