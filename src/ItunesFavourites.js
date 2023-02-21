import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FAVOURITES_API = 'http://localhost:3200/favourites'
const SEARCH_API = 'http://localhost:3200/search'

function MyComponent() {
  const [favourites, setFavourites] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // GET request to retrieve all favourites from the API
    axios
      .get(FAVOURITES_API)
      .then(response => {
        setFavourites(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleAddFavourite = (result) => {
    // POST request to add a new favourite to the API
    const { trackId, collectionId, trackName, collectionName, artistName } = result;
    const name = trackName ?? collectionName
    const id = trackId ?? collectionId
    console.log(result.trackId)
    axios
      .post(FAVOURITES_API, { name, id, artist: artistName })
      .then(response => {
        setFavourites(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleDelete = id => {
    // DELETE request to delete a favourite from the API
    axios
      .delete(`${FAVOURITES_API}/${id}`)
      .then(response => {
        setFavourites(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const { query } = event.target;
    axios
      .get(`${SEARCH_API}?q=${query.value}`)
      .then(response => {
        console.log(response.data)
        setSearchResults(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div>
      <div>
        <h3>Search for books or music on the iTunes store:</h3>
        <form onSubmit={event => handleSearch(event)}>
          <input type="text" name="query" />
          <button type="submit">Search</button>
        </form>
        <div>
          <ul>
            {searchResults.map(result => (
              <li key={result.trackId}>{result.trackName ?? result.collectionName } ({result.artistName}) &nbsp;<button onClick={() => handleAddFavourite(result)}>Favourite</button></li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h3>Saved Favourites</h3>
        <ul>
        {favourites.map(favourite => (
          <li key={favourite.id}>{favourite.name } ({favourite.artist}) &nbsp;<button onClick={() => handleDelete(favourite.id)}>Remove</button></li>
        ))}
        </ul>
      </div>
    </div>
  );
}

export default MyComponent;
