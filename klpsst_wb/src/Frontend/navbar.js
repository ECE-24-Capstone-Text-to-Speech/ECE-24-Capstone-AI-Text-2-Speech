import React from "react";
import "./navbar.css";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../Hooks/AuthProvider";

const KLPSST_Bar = () => {
  const page = useLocation();
  const pages = ["Home", "Login", "Register"];
  // const [currUser, setCurrUser] = useState(null); // default no one logged in
  const { user } = useAuth();

  return (
    <div id="top-navbar">
      {pages.map((pageTitle) => (
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
      ))}
      {user ? <b>Welcome: {user}</b> : <b>Not logged in</b>}
    </div>
  );
};

export default KLPSST_Bar;
