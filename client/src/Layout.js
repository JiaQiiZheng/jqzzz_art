import Header from "./Header";
import { Outlet } from "react-router-dom";
import Menu from "./Menu";

export default function Layout() {
  return (
    <main>
      <Header />
      <Menu />
      <Outlet />
    </main>
  );
}
