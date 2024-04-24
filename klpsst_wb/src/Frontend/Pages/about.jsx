import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./about.css";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import MarkdownComponent from "../Components/MarkdownComponent";
import ImageScroller from "../Components/ImageScroller";
// import AboutUs from "../../Markdown/AboutUs.md";
import Disclaimer from "../Components/Disclaimer";

const KLPSST_About = ({}) => {
  const storedTheme = localStorage.getItem("theme");
  const initialTheme = storedTheme ? JSON.parse(storedTheme) : "light";

  // Define dark mode theme
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // Define light mode theme
  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "rgb(243, 180, 65)",
      },
    },
  });

  // State to track theme
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <div className={`about${theme === "dark" ? " dark-mode" : ""}`}>
        <div id="buttons">
          <Button
            onClick={toggleTheme}
            id="toggleButton"
            className="narrow-button"
          >
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
        </div>
        <MarkdownComponent name={"AboutUs"} />
        <ImageScroller images={[{label: "KLPSST (1)", imgPath: "/KLPSST.jpg"}, {label: "KLPSST (2)", imgPath: "/KLPSST (2).jpg"}]} />
        <Disclaimer />
      </div>
    </ThemeProvider>
  );
};

export default KLPSST_About;
