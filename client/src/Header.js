import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  //get section name
  const currentUrlArray = window.location.href.split("/");
  const sectionName = currentUrlArray[currentUrlArray.length - 1];
  const sectionName_create = `/${sectionName}/create`;

  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      credentials: "include",
      method: "POST",
    });
    setUserInfo("");
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        <div className="atelierZZZ">
          <div className="ZZZ">
            <h1>ZZZ</h1>
            <h1>ZZZ</h1>
          </div>
          <h1 id="atelier">Intuition & Computation</h1>
        </div>
      </Link>
      <nav>
        {username && (
          <>
            <Link className="header_button" to={sectionName_create}>
              Create New Publish
            </Link>
            <a className="header_button" onClick={logout}>
              Logout ({username})
            </a>
          </>
        )}
        {!username && (
          <>
            <Link className="header_button" to="/login">
              Login
            </Link>
            <Link className="header_button" to="/register">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
