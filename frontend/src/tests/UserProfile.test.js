import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UserProfile from "../components/UserProfile";

// Helper to render with route param
const renderWithRouter = (ui, { route = "/userprofile/john_doe" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/userprofile/:username" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

// Test the Navbar
describe("Navbar", () => {
  test("renders logo and navigation buttons", () => {
    renderWithRouter(<UserProfile />);

    const logo = screen.getByAltText(/Roamio Logo/i);
    expect(logo).toBeInTheDocument();

    expect(screen.getByText(/Feed/i)).toBeInTheDocument();
    expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
});

// Test Profile Info
describe("Info Section", () => {
  test("renders user details", async () => {
    renderWithRouter(<UserProfile />);

    expect(await screen.findByText(/john_doe's Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Name:/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Location:/i)).toBeInTheDocument();
    expect(screen.getByText(/New York, USA/i)).toBeInTheDocument();
    expect(screen.getByText(/Bio:/i)).toBeInTheDocument();
    expect(screen.getByText(/Traveler and foodie./i)).toBeInTheDocument();
  });

  test("renders and toggles followers/following list", async () => {
    renderWithRouter(<UserProfile />);

    const followersLabel = screen.getByText(/Followers/i);
    fireEvent.click(followersLabel);

    expect(await screen.findByText(/jane_doe/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Following/i));
    expect(await screen.findByText(/travelpage/i)).toBeInTheDocument();
  });

  test("clicking follower navigates to their profile", () => {
    renderWithRouter(<UserProfile />);

    const followersLabel = screen.getByText(/Followers/i);
    fireEvent.click(followersLabel);

    const follower = screen.getByText(/jane_doe/i);
    fireEvent.click(follower);
  });

  test("clicking follow/unfollow button toggles state", async () => {
    renderWithRouter(<UserProfile />);

    const followBtn = await screen.findByText(/Unfollow -/i);
    fireEvent.click(followBtn);
    expect(screen.getByText(/Follow \+/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Follow \+/i));
    expect(screen.getByText(/Unfollow -/i)).toBeInTheDocument();
  });
});

// Test Itinerary Section
describe("Itineraries", () => {
  test("renders user itineraries", async () => {
    renderWithRouter(<UserProfile />);

    expect(await screen.findByText(/A Weekend in NYC/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Times Square, Central Park, and Broadway!/i)).toBeInTheDocument();
    expect(screen.getByText(/Central Park, Broadway/i)).toBeInTheDocument();
    expect(screen.getByText(/Try the street food/i)).toBeInTheDocument();
  });

  test("clicking itinerary navigates to full post", async () => {
    renderWithRouter(<UserProfile />);

    const itinerary = await screen.findByText(/A Weekend in NYC/i);
    fireEvent.click(itinerary);
  });
});
