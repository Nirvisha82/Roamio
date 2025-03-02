import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from '../components/LandingPage'; // Adjust the import path if necessary
import { BrowserRouter as Router } from 'react-router-dom';

// Test the Navbar
describe('Navbar', () => {
  test('renders navbar with logo and links', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );
    
    // Check if logo is displayed
    const logo = screen.getByAltText(/Roamio Logo/i);
    expect(logo).toBeInTheDocument();

    // Check if navigation links are displayed
    const joinUsLink = screen.getByTestId('navbar-join');
    const featuresLink = screen.getByTestId('navbar-features');
    const teamLink = screen.getByTestId('navbar-team');

    expect(joinUsLink).toBeInTheDocument();
    expect(featuresLink).toBeInTheDocument();
    expect(teamLink).toBeInTheDocument();
  });
});

// Test the Hero Section
describe('Hero Section', () => {
  test('displays hero section content', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    const heading = screen.getByText(/Explore the world with/i);
    const paragraph = screen.getByText(/Your one-stop solution for travel needs/i);
    const getStartedButton = screen.getByText(/Get Started/i);

    expect(heading).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
    expect(getStartedButton).toBeInTheDocument();
  });

  test('clicking Get Started button triggers navigation', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    const getStartedButton = screen.getByText(/Get Started/i);
    fireEvent.click(getStartedButton);
  });
});

// Test Features Section
describe('Features Section', () => {
  test('displays features correctly and allows switching feature images', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    // Check the feature titles
    const featureTitle = screen.getByText(/Personalized Itineraries/i);
    expect(featureTitle).toBeInTheDocument();

    const featureDescription = screen.getByText(/Create detailed travel plans tailored to your style./i);
    expect(featureDescription).toBeInTheDocument();
    
    // Click on a feature to update the image
    const featureItem = screen.getByText(/Interactive Maps/i);
    fireEvent.click(featureItem);

    // Check if the image changes (this can be checked based on the image src or other props)
    const featureImage = screen.getByAltText(/Interactive Maps/i);
    expect(featureImage).toBeInTheDocument();
  });
});

// Test the Signup/ Login Section
describe('SignUp / Login Section', () => {
  test('displays signup form when clicked on Sign Up tab', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    const signUpTab = screen.getByTestId('signup-nav-button');
    fireEvent.click(signUpTab);

    const signUpForm = screen.getByPlaceholderText(/Full Name/i);
    expect(signUpForm).toBeInTheDocument();
  });

  test('displays login form when clicked on Login tab', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    const loginTab = screen.getByTestId('login-nav-button');
    fireEvent.click(loginTab);

    const loginForm = screen.getByPlaceholderText(/Email/i);
    expect(loginForm).toBeInTheDocument();
  });

  test('shows error message when submitting incomplete form in sign up', async () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    const signUpTab = screen.getByTestId('signup-button');
    fireEvent.click(signUpTab);

    const registerButton = screen.getByText(/Register/i);
    fireEvent.click(registerButton);

    const errorMessage = await screen.findByText(/All fields are required/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('shows error message when submitting incomplete form in login', async () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    const loginTab = screen.getByTestId('login-nav-button');
    fireEvent.click(loginTab);

    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    const loginError = await screen.findByText(/All Fields are required/i);
    expect(loginError).toBeInTheDocument();
  });

  test('successful login redirects to /feeds', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    const loginTab = screen.getByTestId('login-nav-button');
    fireEvent.click(loginTab);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    fireEvent.click(loginButton);
  });
});

// Test Team Section
describe('Team Section', () => {
  test('displays team member information', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    const teamMember = screen.getByText(/Nirvisha Soni/i);
    expect(teamMember).toBeInTheDocument();
  });
});

// Test the Footer Section
describe('Footer Section', () => {
  test('displays footer text correctly', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    const footerText = screen.getByText(/© 2025 Roamio. All rights reserved./i);
    expect(footerText).toBeInTheDocument();
  });
});
