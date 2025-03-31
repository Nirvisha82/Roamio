import { render, screen, fireEvent } from "@testing-library/react";
import Feeds from "../components/Feeds"; 
import { BrowserRouter as Router } from "react-router-dom";

// Test the Navbar
describe("Navbar", () => {
  test("renders navbar with logo and links", () => {
    render(
      <Router>
        <Feeds />
      </Router>
    );

    const logo = screen.getByAltText(/Roamio Logo/i);
    expect(logo).toBeInTheDocument();

    const myProfileButton = screen.getByText(/My Profile/i);
    const logoutButton = screen.getByText(/Logout/i);

    expect(myProfileButton).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  test("clicking My Profile button triggers navigation", () => {
    render(
      <Router>
        <Feeds />
      </Router>
    );

    const myProfileButton = screen.getByText(/My Profile/i);
    fireEvent.click(myProfileButton);
  });

  test("clicking Logout removes user and redirects", () => {
      render(
        <Router>
          <Feeds />
        </Router>
      );
  
      const logoutButton = screen.getByText(/Logout/i);
      fireEvent.click(logoutButton);
  
      expect(localStorage.getItem("currentUser")).toBeNull();
    });
});

// Test the Sidebar
describe("Sidebar", () => {
  test("renders trending states", () => {
    render(
      <Router>
        <Feeds />
      </Router>
    );

    const trendingState = screen.getByText(/Trending States/i);
    expect(trendingState).toBeInTheDocument();

    const california = screen.getByText(/California/i);
    const colorado = screen.getByText(/Colorado/i);

    expect(california).toBeInTheDocument();
    expect(colorado).toBeInTheDocument();
  });

  test("clicking a state navigates to state page", () => {
    render(
      <Router>
        <Feeds />
      </Router>
    );

    const california = screen.getByText(/California/i);
    fireEvent.click(california);
  });
});

// Test the Search and Create Post Section
describe("Search & Create Post", () => {
  test("renders search and create post buttons", () => {
    render(
      <Router>
        <Feeds />
      </Router>
    );

    const searchHeading = screen.getByText(/Search your destination/i);
    const createPostButton = screen.getByText(/Create Post/i);

    expect(searchHeading).toBeInTheDocument();
    expect(createPostButton).toBeInTheDocument();
  });

  test("clicking Create Post button navigates to post page", () => {
    render(
      <Router>
        <Feeds />
      </Router>
    );

    const createPostButton = screen.getByText(/Create Post/i);
    fireEvent.click(createPostButton);
  });
});

// Test Itinerary Section
describe("Itineraries", () => {
  test("renders itinerary list", () => {
    render(
      <Router>
        <Feeds />
      </Router>
    );

    const itineraryHeading = screen.getByText(/All Itineraries/i);
    expect(itineraryHeading).toBeInTheDocument();

    const itinerary1 = screen.getByText(/Trip to Love City Paris/i);
    const itinerary2 = screen.getByText(/New York Adventure/i);

    expect(itinerary1).toBeInTheDocument();
    expect(itinerary2).toBeInTheDocument();
  });

  test("clicking an itinerary navigates to the itinerary page", () => {
    render(
      <Router>
        <Feeds />
      </Router>
    );

    const itinerary = screen.getByText(/Trip to Love City Paris/i);
    fireEvent.click(itinerary);
  });
});