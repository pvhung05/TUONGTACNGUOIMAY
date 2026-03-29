import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("Home Page", () => {
  it("renders the sign translator demo shell", () => {
    render(<HomePage />);

    expect(screen.getByText("Learn")).toBeTruthy();
    expect(screen.getByText("Unit 1")).toBeTruthy();
    expect(screen.getByText("XP Progress")).toBeTruthy();
  });
});
