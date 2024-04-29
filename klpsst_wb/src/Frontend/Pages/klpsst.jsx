import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./klpsst.css";
import { useNavigate, Navigate } from "react-router-dom";
import KLPSSTLOGO from "../../Assets/logo_image.png";
import { useAuth } from "../../Hooks/AuthProvider";
import VoiceRecorder from "../Components/VoiceRecorder";
import FileManager from "../Components/FileManager";
import QueueChecker from "../Components/QueueChecker";
import DownloadComponent from "../Components/DownloadComponent";
import Disclaimer from "../Components/Disclaimer";
// import UploadComponent from "../Components/UploadComponent";

const KLPSST_Page = () => {
  const { setAuth } = useAuth();
  const { user } = useAuth();

  const storedTheme = localStorage.getItem("theme");
  const initialTheme = storedTheme ? JSON.parse(storedTheme) : "light";
  const [file1, setFile1] = useState("");
  const [file2, setFile2] = useState("");

  //redirection code
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);

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
    document.documentElement.style.setProperty("color-scheme", `only ${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // Define a state variable to store the input's value
  const [inputValue, setInputValue] = useState("");

  // Create an event handler function to update the input value
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const logOut = async (e) => {
    e.preventDefault();

    if (localStorage.getItem("loggedIn") === "true") {
      try {
        fetch(process.env.REACT_APP_SERVER_ADDRESS + "/users/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include token if the server needs to log or take action based on the token
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // Clear the token from local storage or wherever it's stored
            if (data == "User successfully logged out") {
              setAuth(false);
              localStorage.setItem("loggedIn", false);
              setRedirect(true); //for redirection?
              alert("User successfully logged out");
              sessionStorage.removeItem("token");
            } else {
              alert("Cannot logout");
            }
            // Redirect to login page or update UI accordingly
          });
      } catch (error) {
        console.error("Logout Error:", error);
      }
    } else {
      setRedirect(true);
    }
  };

  if (redirect) {
    console.log(localStorage.getItem("loggedIn"));
    return <Navigate to="/login" />;
  }

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <div id="homepage" className={theme === "dark" ? "dark-mode" : ""}>
        <div id="buttons">
          <Button onClick={toggleTheme} id="toggleButton">
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
          <Button
            onClick={logOut}
            id="checkLogin"
            style={{ marginLeft: "10px" }}
          >
            {localStorage.getItem("loggedIn") === "true" ? "Logout" : "Login"}
          </Button>
        </div>
        <Typography variant="h1">KLPSST</Typography>
        <img
          src={KLPSSTLOGO}
          alt="logo"
          style={{ width: "168px", height: "168px" }}
        />
        <label htmlFor="userInput" style={{ textAlign: "left" }}>
          Type a sentence:
        </label>
        <input
          type="text"
          id="userInput"
          name="userInput"
          placeholder="sentence"
          value={inputValue}
          onChange={handleInputChange}
        />
        <p>You typed: {inputValue}</p>

        <QueueChecker text={inputValue} />

        <DownloadComponent />
        <FileManager />

        <Disclaimer />
      </div>
    </ThemeProvider>
  );
};

export default KLPSST_Page;

var sleepSetTimeout_ctrl;
function sleep(ms) {
  clearInterval(sleepSetTimeout_ctrl);
  return new Promise(
    (resolve) => (sleepSetTimeout_ctrl = setTimeout(resolve, ms))
  );
}
