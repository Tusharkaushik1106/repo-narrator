import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Landing page", () => {
  it("renders the hero headline", () => {
    render(<Home />);
    expect(screen.getByText(/Speak fluent repository/i)).toBeInTheDocument();
  });
});


