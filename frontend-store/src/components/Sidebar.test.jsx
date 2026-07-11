import { fireEvent, render, screen } from "@testing-library/react";
import { LayoutDashboard } from "lucide-react";
import Sidebar from "./Sidebar";

test("shows a home navigation action instead of logout", () => {
  const onHome = jest.fn();

  render(
    <Sidebar
      navItems={[{ id: "dashboard", icon: LayoutDashboard, label: "Dashboard" }]}
      activeNav="dashboard"
      onNavChange={jest.fn()}
      onHome={onHome}
    />
  );

  expect(screen.queryByText("Logout")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /go back to home/i }));

  expect(onHome).toHaveBeenCalledTimes(1);
});
