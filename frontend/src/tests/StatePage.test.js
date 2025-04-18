import { render, screen, fireEvent } from "@testing-library/react";
import StatePage from "../components/StatePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Helper for rendering with route params
const renderWithRouter = (stateCode = "NY") => {
    render(
      <Router>
        <Routes>
          <Route path="/state/:stateCode" element={<StatePage />} />
        </Routes>
      </Router>
    );
  
    // Simulate being on the correct URL
    window.history.pushState({}, "Test page", `/state/${stateCode}`);
};

// Test the Sidebar
describe("Sidebar", () => {
  test("renders trending states", () => {
    renderWithRouter();
    expect(screen.getByText(/Trending/i)).toBeInTheDocument();
    expect(screen.getByText(/California/i)).toBeInTheDocument();
    expect(screen.getByText(/Texas/i)).toBeInTheDocument();
  });

  test("clicking a trending state navigates to that state page", () => {
    renderWithRouter();
    const stateLink = screen.getByText(/California/i);
    fireEvent.click(stateLink);
  });
});

// Test Follow/Unfollow
describe("Follow/Unfollow Button", () => {
  test("shows Follow button initially", () => {
    renderWithRouter();
    expect(screen.getByTestId("follow-button")).toBeInTheDocument();
  });

  test("clicking Follow switches to Unfollow", () => {
    renderWithRouter();
    const followButton = screen.getByTestId("follow-button");
    fireEvent.click(followButton);
    expect(screen.getByText(/Unfollow/i)).toBeInTheDocument();
  });
});

// Test Itineraries
describe("Itinerary Section", () => {
  test("renders itinerary heading and list", () => {
    renderWithRouter();
    expect(screen.getByText(/New York Itineraries/i)).toBeInTheDocument();
    expect(screen.getByText(/A Weekend in NYC/i)).toBeInTheDocument();
    expect(screen.getByText(/Upstate New York Escape/i)).toBeInTheDocument();
  });

  test("clicking itinerary navigates to post page", () => {
    renderWithRouter();
    const itinerary = screen.getByText(/A Weekend in NYC/i);
    fireEvent.click(itinerary);
  });
});
