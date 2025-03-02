import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders LandingPage on the root route', () => {
    render(<App />);

    const landingPageElement = screen.getByText(/Explore/i); 
    expect(landingPageElement).toBeInTheDocument();
  });
});
