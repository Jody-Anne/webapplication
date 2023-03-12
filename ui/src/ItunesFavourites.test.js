import React from 'react';
import axios from 'axios';
import {render, fireEvent, waitFor } from '@testing-library/react'
import MyComponent from './ItunesFavourites';

jest.mock('axios');

describe('MyComponent', () => {
  let appRender;

  beforeEach(() => {
    const mockFavourites = [{name: 'Favourite 1', id: 1, artist: 'Artist 1'}];
    const mockSearchResults = [
      {trackId: 1, trackName: 'Track 1', artistName: 'Artist 1'},
      {trackId: 2, trackName: 'Track 2', artistName: 'Artist 2'},
    ];

    axios.get.mockResolvedValueOnce({data: mockFavourites});
    axios.get.mockResolvedValueOnce({data: mockSearchResults});
    axios.post.mockResolvedValueOnce({data: mockFavourites});

    appRender = render(<MyComponent />)
  })

  test('render search button', async () => {
    await waitFor(() => {
      const searchBtn = appRender.getByRole('button', {
        name: /Search/i
      });
      expect(searchBtn).toBeInTheDocument();
    })
  })

  test('search for song', async () => {
    const searchInput = appRender.container.querySelector(`input[name="query"]`);
    fireEvent.change(searchInput, {target: {value: 'mysong'}});

    const select = appRender.container.querySelector(`select[name="media"]`);
    fireEvent.change(select, {target: {value: 'music'}});

    const searchBtn = appRender.getByRole('button', {
      name: /Search/i
    });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://webapplication-qpi4.onrender.com/search?q=mysong&media=music');
      const searchResult = appRender.getByText('Track 1 (Artist 1)');
      expect(searchResult).toBeInTheDocument();
    });
  });

  test('add favourite', async () => {
    const searchInput = appRender.container.querySelector(`input[name="query"]`);
    fireEvent.change(searchInput, {target: {value: 'mysong'}});

    const select = appRender.container.querySelector(`select[name="media"]`);
    fireEvent.change(select, {target: {value: 'music'}});

    const searchBtn = appRender.getByRole('button', {
      name: /Search/i
    });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      const favButtons = appRender.getAllByText('Favourite 👌');
      fireEvent.click(favButtons[0]);
      expect(axios.post).toHaveBeenCalledWith('https://webapplication-qpi4.onrender.com/favourites', {
        name: 'Track 1',
        id: 1,
        artist: 'Artist 1',
      });
    });

    await waitFor(() => {
      const favResult = appRender.getByText('Favourite 1 - Artist 1');
      expect(favResult).toBeInTheDocument();
    });
  });

  test('delete favourite', async () => {
    const mockFavourites = [{name: 'Favourite 1', id: 1, artist: 'Artist 1'}];

    axios.get.mockResolvedValueOnce({data: mockFavourites});
    axios.delete.mockResolvedValueOnce({data: []});

    const {getByText, getAllByText} = render(<MyComponent/>);

    await waitFor(() => {
      const favResult = getByText('Favourite 1 - Artist 1');
      expect(favResult).toBeInTheDocument();
      const deleteButtons = getAllByText('Delete 😔');
      fireEvent.click(deleteButtons[0]);
      expect(axios.delete).toHaveBeenCalledWith('https://webapplication-qpi4.onrender.com/favourites/1');
    });

    await waitFor(() => {
      const noFavResult = getByText('No favourites yet!');
      expect(noFavResult).toBeInTheDocument();
    });
  });
});