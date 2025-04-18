import { render, screen, fireEvent } from "@testing-library/react";
import PostForm from "../components/PostForm";
import { BrowserRouter as Router } from "react-router-dom";

// Mock useNavigate from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("PostForm Component", () => {
  // Navbar Tests
  describe("Navbar", () => {
    test("renders navbar with logo and navigation buttons", () => {
      render(
        <Router>
          <PostForm />
        </Router>
      );

      expect(screen.getByAltText(/Roamio Logo/i)).toBeInTheDocument();
      expect(screen.getByText(/Feed/i)).toBeInTheDocument();
      expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
      expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    });

    test("clicking Feed, My Profile, and Logout buttons triggers navigation", () => {
      render(
        <Router>
          <PostForm />
        </Router>
      );

      fireEvent.click(screen.getByText(/Feed/i));
      fireEvent.click(screen.getByText(/My Profile/i));
      fireEvent.click(screen.getByText(/Logout/i));
    });
  });

  // Form Rendering Tests
  describe("Form Fields", () => {
    test("renders all input fields and labels", () => {
      render(
        <Router>
          <PostForm />
        </Router>
      );

      expect(screen.getByLabelText(/Itinerary Title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Number of Days/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Number of Nights/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Group Size/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Estimated Budget/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Trip Highlights/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Stay Suggestions/i)).toBeInTheDocument();
      expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    });
  });

  // Form Submission
  describe("Form Behavior", () => {
    test("fills in form and submits", () => {
      render(
        <Router>
          <PostForm />
        </Router>
      );

      fireEvent.change(screen.getByLabelText(/Itinerary Title/i), { target: { value: "Beach Trip" } });
      fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "A relaxing trip to the coast" } });
      fireEvent.change(screen.getByLabelText(/Number of Days/i), { target: { value: "5" } });
      fireEvent.change(screen.getByLabelText(/Number of Nights/i), { target: { value: "4" } });
      fireEvent.change(screen.getByLabelText(/Group Size/i), { target: { value: "3" } });
      fireEvent.change(screen.getByLabelText(/Estimated Budget/i), { target: { value: "1500" } });
      fireEvent.change(screen.getByLabelText(/Trip Highlights/i), { target: { value: "Beach, Surfing" } });
      fireEvent.change(screen.getByLabelText(/Stay Suggestions/i), { target: { value: "Cozy Airbnb near the beach" } });

      fireEvent.click(screen.getByText(/Submit/i));
    });
  });
});
