import { Link } from "react-router-dom";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { UserContext } from "./UserContext";
import UserButton from "./Components/UserButton/UserButton";

const managers = ["jqzzz", "116171553013983315605", "103267673267484429463"];

export default function Header() {
  //get section name
  const currentUrlArray = window.location.href.split("/");
  const sectionName = currentUrlArray[3];
  const sectionName_create = `${sectionName}/create`;
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [username, setUsername] = useState();

  useEffect(() => {
    if (Object.keys(userInfo).length !== 0) {
      fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        credentials: "include",
      }).then((response) => {
        response.json().then((userInfo) => {
          setUserInfo(userInfo);
        });
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(userInfo).length) {
      document.getElementById("header_buttons")?.classList.add("hide");
    } else {
      document.getElementById("header_buttons")?.classList.remove("hide");
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
    setUserInfo([]);
  }

  useEffect(() => {
    if (userInfo) {
      const user = userInfo.username
        ? userInfo.username
        : userInfo.sub
        ? userInfo.sub
        : "";
      setUsername(user);
    }
  }, [userInfo]);

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
        {/* {username && (
          <> */}
        {/* {(managers.includes(username) || sectionName === "computation") && (
              <Link className="header_button" to={sectionName_create}>
                New Publish
              </Link>
            )} */}
        {/* {username != `${manager}` && sectionName != "computation" && (
              <Link className="header_button">
                working hard organizing projects
              </Link>
            )} */}
        {/* <a className="header_button" onClick={logout}>
          Logout ({username})
        </a> */}
        {/* </>
        )} */}

        <div className="regular_buttons">
          <div id="searchBar">
            <span class="material-symbols-outlined">search</span>
            <input id="text_container" type="text" />
          </div>
        </div>

        {Object.keys(userInfo).length == 0 && (
          <div id="header_buttons">
            <div className="signIn_buttons">
              <a id="signIn_button" href={`${window.location.origin}/login`}>
                <span class="material-symbols-outlined">account_circle</span>
              </a>
            </div>
            {/* <Link className="header_button" to="/login">
              Login
            </Link> */}
            {/* <Link className="header_button" to="/register">
              Register
            </Link> */}
          </div>
        )}

        {((userInfo && managers.includes(username)) ||
          sectionName === "computation") && (
          <div id="function_buttons">
            <a
              className="header_button_ui"
              href={`${window.location.origin}/${sectionName_create}`}
            >
              <span class="material-symbols-outlined">edit_square</span>
            </a>
          </div>
        )}
        <div id="user_buttons">
          <UserButton />
        </div>
      </nav>
    </header>
  );
}
