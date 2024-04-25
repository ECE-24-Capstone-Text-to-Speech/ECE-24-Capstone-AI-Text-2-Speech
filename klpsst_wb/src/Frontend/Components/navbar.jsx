import React, { useEffect } from "react";
import "./navbar.css";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../Hooks/AuthProvider";

const KLPSST_Bar = () => {
  const page = useLocation();
  const logged_in_pages = ["Home", "Register", "About"];
  const logged_out_pages = ["Login", "Register", "About"];
  // const [currUser, setCurrUser] = useState(null); // default no one logged in
  const { user } = useAuth();

  useEffect(() => {
    console.log("!!! PINGING SERVER !!!");

    var okStatus = false;
    fetch(process.env.REACT_APP_SERVER_ADDRESS, {
      method: "GET",
    })
      .then((res) => {
        okStatus = res.ok;
        return res.json();
      })
      .then((data) => {
        console.log(JSON.stringify(data));
        if (!okStatus) {
          throw new Error("Failed to reach server");
        }
      })
      .catch((error) => {
        const SERVER_OFFLINE_MESSAGE =
          "KLPSST service is not online, please email klpsst6@gmail.com and ask the devs to turn the server on";
        console.log(SERVER_OFFLINE_MESSAGE);
        alert(SERVER_OFFLINE_MESSAGE);
      });
  }, ["__INIT__"]);

  const linkButton = (pageTitle) => (
    <Link
      key={pageTitle}
      to={`/${pageTitle.toLowerCase()}`}
      className={
        page.pathname === `/${pageTitle.toLowerCase()}` ||
        (pageTitle === "Home" &&
          (page.pathname === "" || page.pathname === "/"))
          ? "active"
          : ""
      }
      style={{ paddingLeft: "10px", paddingRight: "10px" }} // Adjust the padding as needed
    >
      {pageTitle}
    </Link>
  );

  return (
    <div id="top-navbar">
      {user
        ? logged_in_pages.map(linkButton)
        : logged_out_pages.map(linkButton)}
      {user ? <b>Welcome: {user}</b> : <b>Not logged in</b>}
    </div>
  );
};

export default KLPSST_Bar;
