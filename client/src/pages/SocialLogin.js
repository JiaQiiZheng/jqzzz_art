import React, { useEffect, useState, useContext } from "react";
import jwt_decode from "jwt-decode";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function SocialLogin() {
  const [redirect, setRedirect] = useState();
  const { setUserInfo } = useContext(UserContext);
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );

  //   for popup mode
  const handleCallbackResponse = async (response) => {
    // var userObject = jwt_decode(response.credential);
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/google-login-popup`,
      {
        method: "POST",
        body: JSON.stringify({
          token: response.credential,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();

    setRedirect(true);
    setLoginData(data);
    setUserInfo(data);
    localStorage.setItem("loginData", JSON.stringify(data));
    document.getElementById("signInDiv").hidden = true;
  };

  function handleSignOut() {
    localStorage.removeItem("loginData");
    setLoginData(null);
    setUserInfo([]);
    document.getElementById("signInDiv").hidden = false;
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_CLIENT_ID,
      callback: handleCallbackResponse,
      ux_mode: "popup",
      prompt_parent_id: "g_id_onload",
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "filled_black",
      shape: "pill",
      size: "large",
      width: 220,
      type: "icon",
    });
    !loginData && google.accounts.id.prompt();
  }, []);

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="auth_google">
      <p>or login with</p>
      <div id="signInDiv"></div>
      {loginData && (
        <button id="signOutButton" onClick={handleSignOut}>
          sign out google account
        </button>
      )}
      <div
        id="g_id_onload"
        data-client_id={process.env.REACT_APP_GOOGLE_CLIENT_CLIENT_ID}
        data-login_uri={`${process.env.REACT_APP_API_URL}/google-login-popup`}
      ></div>
    </div>
  );
}
