import React from 'react';
import axios from 'axios';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MyComponent from './ItunesFavourites';

jest.mock('axios');

describe('MyComponent', () => {
test('search and add favourite', async () => {
const mockFavourites = [{ name: 'Favourite 1', id: 1, artist: 'Artist 1' }];
const mockSearchResults = [
{ trackId: 1, trackName: 'Track 1', artistName: 'Artist 1' },
{ trackId: 2, trackName: 'Track 2', artistName: 'Artist 2' },
];

axios.get.mockResolvedValueOnce({ data: mockFavourites });
axios.get.mockResolvedValueOnce({ data: mockSearchResults });
axios.post.mockResolvedValueOnce({ data: mockFavourites });

const { getByText, getByLabelText, getByTestId } = render(<MyComponent />);

const searchInput = getByLabelText('Search:');
fireEvent.change(searchInput, { target: { value: 'music' } });

const select = getByLabelText('Media Type:');
fireEvent.change(select, { target: { value: 'music' } });

const searchButton = getByText('Search');
fireEvent.click(searchButton);

await waitFor(() => {
  const searchResult = getByText('Track 1 (Artist 1)');
  expect(searchResult).toBeInTheDocument();
  const favButton = getByText('Favourite 👌');
  fireEvent.click(favButton);
  expect(axios.post).toHaveBeenCalledWith('http://localhost:3200/favourites', {
    name: 'Track 1',
    id: 1,
    artist: 'Artist 1',
  });
});

await waitFor(() => {
  const favResult = getByText('Favourite 1 - Artist 1');
  expect(favResult).toBeInTheDocument();
});
});

test('delete favourite', async () => {
const mockFavourites = [{ name: 'Favourite 1', id: 1, artist: 'Artist 1' }];

axios.get.mockResolvedValueOnce({ data: mockFavourites });
axios.delete.mockResolvedValueOnce({ data: [] });

const { getByText } = render(<MyComponent />);

await waitFor(() => {
  const favResult = getByText('Favourite 1 - Artist 1');
  expect(favResult).toBeInTheDocument();
  const deleteButton = getByText('Delete 😔');
  fireEvent.click(deleteButton);
  expect(axios.delete).toHaveBeenCalledWith('http://localhost:3200/favourites/1');
});

await waitFor(() => {
  const noFavResult = getByText('No favourites yet!');
  expect(noFavResult).toBeInTheDocument();
});
});
});
