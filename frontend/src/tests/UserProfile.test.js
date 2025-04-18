import { render, screen, fireEvent } from "@testing-library/react";
import UserProfile from "../components/UserProfile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Mock useParams to simulate the username param
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ username: "john_doe" }),
  useNavigate: () => jest.fn(),
}));

describe("UserProfile Component", () => {
  test("renders user profile with basic details", () => {
    render(
      <Router>
        <Routes>
          <Route path="/" element={<UserProfile />} />
        </Routes>
      </Router>
    );

    expect(screen.getByText(/john_doe's Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Name:/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Location:/i)).toBeInTheDocument();
    expect(screen.getByText(/New York, USA/i)).toBeInTheDocument();
    expect(screen.getByText(/Bio:/i)).toBeInTheDocument();
    expect(screen.getByText(/Traveler and foodie/i)).toBeInTheDocument();
  });

  test("renders itinerary list", () => {
    render(
      <Router>
        <Routes>
          <Route path="/" element={<UserProfile />} />
        </Routes>
      </Router>
    );

    const itineraryTitle = screen.getByText(/A Weekend in NYC/i);
    expect(itineraryTitle).toBeInTheDocument();

    const description = screen.getByText(/Explore Times Square, Central Park, and Broadway!/i);
    expect(description).toBeInTheDocument();

    const highlights = screen.getByText(/Highlights:/i);
    expect(highlights).toBeInTheDocument();
    expect(screen.getByText(/Central Park, Broadway/i)).toBeInTheDocument();
  });

  test("renders and toggles followers list", () => {
    render(
      <Router>
        <Routes>
          <Route path="/" element={<UserProfile />} />
        </Routes>
      </Router>
    );

    const followersHeading = screen.getByText(/Followers/i);
    fireEvent.click(followersHeading);

    expect(screen.getByText(/jane_doe/i)).toBeInTheDocument();
  });

  test("renders and toggles following list", () => {
    render(
      <Router>
        <Routes>
          <Route path="/" element={<UserProfile />} />
        </Routes>
      </Router>
    );

    const followingsHeading = screen.getByText(/Following/i);
    fireEvent.click(followingsHeading);

    expect(screen.getByText(/travelpage/i)).toBeInTheDocument();
  });

  test("follow/unfollow button toggles text", () => {
    render(
      <Router>
        <Routes>
          <Route path="/" element={<UserProfile />} />
        </Routes>
      </Router>
    );

    const followButton = screen.getByText(/Unfollow -/i);
    expect(followButton).toBeInTheDocument();

    fireEvent.click(followButton);

    const followButtonAfterClick = screen.getByText(/Follow \+/i);
    expect(followButtonAfterClick).toBeInTheDocument();
  });

  test("navbar buttons render correctly", () => {
    render(
      <Router>
        <Routes>
          <Route path="/" element={<UserProfile />} />
        </Routes>
      </Router>
    );

    expect(screen.getByAltText(/Roamio Logo/i)).toBeInTheDocument();
    expect(screen.getByText(/Feed/i)).toBeInTheDocument();
    expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
});
