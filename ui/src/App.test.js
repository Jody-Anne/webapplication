import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

it('app renders correctly', () => {
  const app = renderer.create(<App />).toJSON();
  expect(app).toMatchSnapshot();
});
