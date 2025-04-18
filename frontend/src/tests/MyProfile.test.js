import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "../components/MyProfile";
import { BrowserRouter as Router } from "react-router-dom";

// Test the Profile component

describe("Profile Component", () => {
  test("renders profile heading and basic details", async () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    // Wait for loading to complete
    const heading = await screen.findByText(/My Profile/i);
    expect(heading).toBeInTheDocument();

    expect(screen.getByText(/Full Name:/i)).toBeInTheDocument();
    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText(/Username:/i)).toBeInTheDocument();
    expect(screen.getByText(/Location:/i)).toBeInTheDocument();
    expect(screen.getByText(/Bio:/i)).toBeInTheDocument();
  });

  test("renders followers and followings counts", async () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    const followers = await screen.findByText(/Followers/i);
    const followings = await screen.findByText(/Following/i);

    expect(followers).toBeInTheDocument();
    expect(followings).toBeInTheDocument();
  });

  test("renders itinerary section", async () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    const itineraryHeading = await screen.findByText(/My Itineraries/i);
    expect(itineraryHeading).toBeInTheDocument();

    const itinerary = screen.getByText(/Trip to Italy/i);
    expect(itinerary).toBeInTheDocument();
  });

  test("clicking followers shows list", async () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    const followersSection = await screen.findByText(/Followers/i);
    fireEvent.click(followersSection);

    const follower = await screen.findByText(/jane_doe/i);
    expect(follower).toBeInTheDocument();
  });

  test("clicking followings shows list and unfollow button", async () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    const followingsSection = await screen.findByText(/Following/i);
    fireEvent.click(followingsSection);

    const following = await screen.findByText(/jane_doe/i);
    expect(following).toBeInTheDocument();

    const unfollowButton = screen.getAllByText(/Unfollow/i)[0];
    expect(unfollowButton).toBeInTheDocument();
  });

  test("clicking logout removes user and navigates", async () => {
    localStorage.setItem("currentUser", "mockUser");

    render(
      <Router>
        <Profile />
      </Router>
    );

    const logoutButton = await screen.findByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(localStorage.getItem("currentUser")).toBeNull();
  });
});
