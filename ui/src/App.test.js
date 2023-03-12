import renderer from 'react-test-renderer';
import App from './App';

test('create a snapshot and test that it matches', () => {
  const app = renderer.create(<App />).toJSON();
  expect(app).toMatchSnapshot();
});
