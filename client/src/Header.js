import { Link } from "react-router-dom";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { UserContext } from "./UserContext";
import UserButton from "./Components/UserButton/UserButton";

const manager = "jqzzz";

export default function Header() {
  //get section name
  const currentUrlArray = window.location.href.split("/");
  const sectionName = currentUrlArray[3];
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

  useEffect(() => {
    if (userInfo) {
      document.getElementById("header_buttons").classList.add("hide");
    } else {
      document.getElementById("header_buttons").classList.remove("hide");
    }
  }, [userInfo]);

  useEffect(() => {
    const googleUser = JSON.parse(localStorage.getItem("loginData"));
    if (googleUser) {
      fetch(
        `${process.env.REACT_APP_API_URL}/google-profile/${googleUser.email}`
      )
        .then((response) => {
          return response.json();
        })
        .then((userData) => setUserInfo(userData));
    }
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
            {(username === `${manager}` || sectionName === "computation") && (
              <Link className="header_button" to={sectionName_create}>
                New Publish
              </Link>
            )}
            {/* {username != `${manager}` && sectionName != "computation" && (
              <Link className="header_button">
                working hard organizing projects
              </Link>
            )} */}
            {/* <a className="header_button" onClick={logout}>
              Logout ({username})
            </a> */}
          </>
        )}

        {!username && (
          <div id="header_buttons">
            <Link className="header_button" to="/login">
              Login
            </Link>
            <Link className="header_button" to="/register">
              Register
            </Link>
          </div>
        )}
        <div id="user_buttons">
          <UserButton />
        </div>
      </nav>
    </header>
  );
}
