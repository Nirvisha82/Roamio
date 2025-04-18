import { render, screen, fireEvent } from "@testing-library/react";
import FullPost from "../components/FullPost";
import { BrowserRouter as Router } from "react-router-dom";

// Test the Navbar
describe("Navbar", () => {
  test("renders navbar with logo and buttons", () => {
    render(
      <Router>
        <FullPost />
      </Router>
    );

    const logo = screen.getByAltText(/Roamio Logo/i);
    expect(logo).toBeInTheDocument();

    const feedButton = screen.getByText(/Feed/i);
    const myProfileButton = screen.getByText(/My Profile/i);
    const logoutButton = screen.getByText(/Logout/i);

    expect(feedButton).toBeInTheDocument();
    expect(myProfileButton).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  test("clicking navigation buttons triggers navigation", () => {
    render(
      <Router>
        <FullPost />
      </Router>
    );

    const feedButton = screen.getByText(/Feed/i);
    const myProfileButton = screen.getByText(/My Profile/i);
    const logoutButton = screen.getByText(/Logout/i);

    fireEvent.click(feedButton);
    fireEvent.click(myProfileButton);
    fireEvent.click(logoutButton);
  });
});

// Test Profile Sidebar
describe("Profile Sidebar", () => {
  test("renders profile information and follow button", () => {
    render(
      <Router>
        <FullPost />
      </Router>
    );

    const profileImage = screen.getByAltText(/Profile/i);
    expect(profileImage).toBeInTheDocument();

    const username = screen.getByText(/JohnDoe/i);
    expect(username).toBeInTheDocument();

    const followButton = screen.getByText(/Follow \+/i);
    expect(followButton).toBeInTheDocument();
  });

  test("clicking Follow button toggles text", () => {
    render(
      <Router>
        <FullPost />
      </Router>
    );

    const followButton = screen.getByText(/Follow \+/i);
    fireEvent.click(followButton);
    expect(screen.getByText(/Unfollow -/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Unfollow -/i));
    expect(screen.getByText(/Follow \+/i)).toBeInTheDocument();
  });
});

// Test Post Details
describe("Post Details", () => {
  test("displays post title and description", () => {
    render(
      <Router>
        <FullPost />
      </Router>
    );

    const title = screen.getByText(/Amazing Trip to Paris/i);
    expect(title).toBeInTheDocument();

    const description = screen.getByText(/Visited all the major attractions in Paris and had an unforgettable experience!/i);
    expect(description).toBeInTheDocument();
  });

  test("displays trip details", () => {
    render(
      <Router>
        <FullPost />
      </Router>
    );

    expect(screen.getByText(/Days: 5, Nights: 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget: \$1500, Group Size: 4 people/i)).toBeInTheDocument();
    expect(screen.getByText(/Highlights: Eiffel Tower, Louvre Museum, Seine River Cruise/i)).toBeInTheDocument();
    expect(screen.getByText(/Suggestions: Book tickets in advance to avoid long queues./i)).toBeInTheDocument();
  });

  test("displays images in the slider", () => {
    render(
      <Router>
        <FullPost />
      </Router>
    );

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(1);
  });
});

// Test Comments Section
describe("Comments Section", () => {
  test("renders existing comments", () => {
    render(
      <Router>
        <FullPost />
      </Router>
    );

    expect(screen.getByText(/Great post! Very informative./i)).toBeInTheDocument();
    expect(screen.getByText(/I love this itinerary, thanks for sharing!/i)).toBeInTheDocument();
  });

  test("renders username and profile picture for each comment", () => {
    render(
      <Router>
        <FullPost />
      </Router>
    );
  
    const usernames = screen.getAllByText("Jane_Doe");
    const profilePics = screen.getAllByAltText("User");

    expect(usernames.length).toBeGreaterThanOrEqual(2);
    expect(profilePics.length).toBeGreaterThanOrEqual(2);
  });
  
  test("allows user to add a new comment", () => {
    render(
      <Router>
        <FullPost />
      </Router>
    );

    const commentInput = screen.getByPlaceholderText(/Write a comment.../i);
    const addCommentButton = screen.getByText(/Add Comment/i);

    fireEvent.change(commentInput, { target: { value: "This is a test comment" } });
    fireEvent.click(addCommentButton);

    expect(screen.getByText(/This is a test comment/i)).toBeInTheDocument();
  });

  test("does not add an empty comment", () => {
    render(
      <Router>
        <FullPost />
      </Router>
    );

    const addCommentButton = screen.getByText(/Add Comment/i);
    fireEvent.click(addCommentButton);

    expect(screen.queryByText(/This is a test comment/i)).not.toBeInTheDocument();
  });
});
