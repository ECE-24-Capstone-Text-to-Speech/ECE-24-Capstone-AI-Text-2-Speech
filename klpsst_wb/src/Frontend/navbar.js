import React from "react";
import "./navbar.css";
import { Link, useLocation } from "react-router-dom";

const KLPSST_Bar = () => {
  const page = useLocation();
  const pages = ["Home", "Login"];

  return (
    <div id="test">
      {pages.map((pageTitle) => (
        <Link
          key={pageTitle}
          to={`/${pageTitle.toLowerCase()}`}
          className={
            page.pathname === `/${pageTitle.toLowerCase()}` ||
            (pageTitle === "Home" && (page.pathname === "" || page.pathname === "/"))
              ? "active"
              : ""
          }
          style={{ paddingLeft: "10px", paddingRight: "10px" }} // Adjust the padding as needed

        >
          {pageTitle}
        </Link>
      ))}
    </div>
  );
};

export default KLPSST_Bar;