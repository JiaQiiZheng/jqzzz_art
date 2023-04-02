import Header from "./Header";
import Header_ComputationalCommunity from "./Header_ComputationalCommunity";
import { Outlet } from "react-router-dom";
import Menu from "./Menu";

export default function Layout() {
  return (
    <main>
      <Header_ComputationalCommunity />
      <Menu />
      <Outlet />
    </main>
  );
}
