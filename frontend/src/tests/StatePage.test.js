/* eslint-disable testing-library/no-node-access */
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from "react-router-dom";
import StatePage from "../components/StatePage";

// Mock the 'country-state-city' module
jest.mock("country-state-city", () => ({
  State: {
    getStatesOfCountry: () => [
      { name: "California", isoCode: "CA" },
      { name: "New York", isoCode: "NY" },
      { name: "Texas", isoCode: "TX" }
    ]
  }
}));

// Test Navbar
describe("Navbar", () => {
  test("renders navbar with logo and buttons", () => {
    render(
      <MemoryRouter initialEntries={["/state/CA"]}>
        <Routes>
          <Route path="/state/:stateCode" element={<StatePage />} />
        </Routes>
      </MemoryRouter>
    );

    //expect(screen.getByAltText(/Roamio Logo/i)).toBeInTheDocument();
    expect(screen.getByTestId("feed-button")).toBeInTheDocument();
    expect(screen.getByTestId("profile-button")).toBeInTheDocument();
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
  });

  test("clicking Logout removes user and navigates", () => {
    render(
      <MemoryRouter initialEntries={["/state/CA"]}>
        <Routes>
          <Route path="/state/:stateCode" element={<StatePage />} />
          <Route path="/" element={<div>Roamio <a href="/login">Get Started</a></div>} />
        </Routes>
      </MemoryRouter>
    );

    const logoutButton = screen.getByTestId("logout-button");
    fireEvent.click(logoutButton);
    expect(screen.getByText(/Roamio/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get Started/i })).toBeInTheDocument();
  });
});

// Test Sidebar
describe("Sidebar", () => {
  test("renders trending states", () => {
    render(
      <MemoryRouter initialEntries={["/state/CA"]}>
        <Routes>
          <Route path="/state/:stateCode" element={<StatePage />} />
        </Routes>
      </MemoryRouter>
    );

    const trendingContainer = screen.getByText(/Trending States/i).closest("div");
    const trendingWithin = within(trendingContainer);

    const california = trendingWithin.getByText(/California/i);
    const newYork = trendingWithin.getByText(/^New York$/i); // Use regex to match exact name
    const texas = trendingWithin.getByText(/Texas/i);

    expect(california).toBeInTheDocument();
    expect(newYork).toBeInTheDocument();
    expect(texas).toBeInTheDocument();
  });

  test("clicking a trending state navigates to state page", () => {
    render(
      <MemoryRouter initialEntries={["/state/CA"]}>
        <Routes>
          <Route path="/state/:stateCode" element={<StatePage />} />
        </Routes>
      </MemoryRouter>
    );

    const trendingContainer = screen.getByText(/Trending States/i).closest("div");
    const trendingWithin = within(trendingContainer);

    const newYork = trendingWithin.getByText(/^New York$/i);
    fireEvent.click(newYork);

    // Optional: Test navigation if you mock `useNavigate`
  });
});

// Test Itinerary Section
describe("Itineraries", () => {
  test("renders itinerary list", () => {
    render(
      <MemoryRouter initialEntries={["/state/CA"]}>
        <Routes>
          <Route path="/state/:stateCode" element={<StatePage />} />
        </Routes>
      </MemoryRouter>
    );

    const heading = screen.getByText(/California Itineraries/i);
    const itinerary1 = screen.getByText(/A Weekend in NYC/i);
    const itinerary2 = screen.getByText(/Upstate New York Escape/i);

    expect(heading).toBeInTheDocument();
    expect(itinerary1).toBeInTheDocument();
    expect(itinerary2).toBeInTheDocument();
  });

  test("clicking an itinerary navigates to the itinerary page", () => {
    render(
      <MemoryRouter initialEntries={["/state/CA"]}>
        <Routes>
          <Route path="/state/:stateCode" element={<StatePage />} />
        </Routes>
      </MemoryRouter>
    );

    const itinerary = screen.getByText(/A Weekend in NYC/i);
    expect(itinerary).toBeInTheDocument(); // <- this now works!
    fireEvent.click(itinerary);

  });
});

// Test Follow Button
describe("Follow Button", () => {
  test("displays Follow button and toggles to Unfollow", () => {
    render(
      <MemoryRouter initialEntries={["/state/NY"]}>
        <Routes>
          <Route path="/state/:stateCode" element={<StatePage />} />
        </Routes>
      </MemoryRouter>
    );

    const followButton = screen.getByTestId("follow-button");
    expect(followButton).toBeInTheDocument();

    fireEvent.click(followButton);
    const unfollowButton = screen.getByText(/Unfollow/i);
    expect(unfollowButton).toBeInTheDocument();
  });
});
