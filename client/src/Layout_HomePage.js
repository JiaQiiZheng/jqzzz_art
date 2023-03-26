import Header_HomePage from "./Header_HomePage";
import { Outlet } from "react-router-dom";
import Menu from "./Menu";

export default function Layout() {
  return (
    <main>
      <Header_HomePage />
      <Menu />
      <Outlet />
    </main>
  );
}
