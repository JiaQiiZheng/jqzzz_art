import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import defaultProfile from "../../assets/ui/svg/account_circle_FILL1_wght100_GRAD0_opsz48.svg";
import "./style.css";

const UserButton = () => {
  const [userData, setUserData] = useState();
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null;
    setUserData(data);
  }, [userInfo]);

  useEffect(() => {
    let menuToggle = document.querySelector(".user-box");
    let menu = document.querySelector(".menu");

    if (menuToggle && menu) {
      menuToggle.onclick = function () {
        menu.classList.toggle("active");
        document.getElementById("userPicture").classList.toggle("active");
      };
    }
  }, []);

  function handleSignOut() {
    localStorage.removeItem("loginData");
    setUserData(null);
    const ele = document.querySelector(".menu");
    if (ele) {
      ele.classList.toggle("active");
    }
    setUserInfo([]);
  }

  function handleClickOutside(event) {
    const domNode = document.getElementsByClassName("userButton")[0];
    if (!domNode || !domNode.contains(event.target)) {
      const menu = document.querySelector(".menu");
      const userPicture = document.getElementById("userPicture");
      menu && menu.classList.remove("active");
      userPicture && userPicture.classList.remove("active");
    }
  }

  return (
    <div className="userButton">
      <div className="user-box">
        <div className="image-box">
          {Object.keys(userInfo).length != 0 && (
            <img
              id="userPicture"
              src={userData?.picture ? userData?.picture : defaultProfile}
              alt=""
            />
          )}
        </div>
        {/* <p className="username">{userData?.name}</p> */}
      </div>
      <div className="menu-box">
        <ul className="menu">
          <li>
            <a href="#">
              <span className="material-symbols-outlined">account_circle</span>
              Profile
            </a>
          </li>
          <li>
            <a href="#">
              <span className="material-symbols-outlined">chat_bubble</span>
              Messages
            </a>
          </li>
          <li>
            <a href="#">
              <span className="material-symbols-outlined">notifications</span>
              Notification
            </a>
          </li>
          <li>
            <a onClick={handleSignOut}>
              <span className="material-symbols-outlined">logout</span>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserButton;
