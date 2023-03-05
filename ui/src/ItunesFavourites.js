import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const FAVOURITES_API = 'http://localhost:3200/favourites'
const SEARCH_API = 'http://localhost:3200/search'

function MyComponent() {
  const [favourites, setFavourites] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [mediaType, setMediaType] = useState('all');

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
      .get(`${SEARCH_API}?q=${query.value}&media=${mediaType}`)
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
        <h3>Search for books or music on the iTunes store 😃:</h3>
        <form onSubmit={event => handleSearch(event)}>
          <input type="text" name="query" />
          <select name="media" value={mediaType} onChange={event => setMediaType(event.target.value)}>
            <option value="all">All</option>
            <option value="music">🎶 Music</option>
            <option value="audiobook">🕮 Audiobooks</option>
            <option value="ebook">📚 Books</option>
     </select>
      <button type="submit">Search</button>
      </form>
<div className="results-container">
   <ul className="search-results">{searchResults.map(result => (
   <li key={result.trackId} className="search-result"> {result.trackName ?? result.collectionName } ({result.artistName})  
      <button className="favourite-btn" onClick={() => handleAddFavourite(result)}>Favourite 👌</button>
   </li>
   ))}
</ul>
</div>
</div>
<div className="favourites-container">
<h3>Favourites🫶:</h3>
<ul className="favourites-list">
{favourites.map(favourite => (
<li key={favourite.id} className="favourite-item">
{favourite.name} - {favourite.artist}  
<button className="delete-btn" onClick={() => handleDelete(favourite.id)}>Delete 😔</button>
</li>
))}
</ul>
</div>
</div>
);
}

export default MyComponent;
