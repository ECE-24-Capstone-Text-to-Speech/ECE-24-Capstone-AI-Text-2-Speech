import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import styled from "styled-components";
import "./login.css";
import { useNavigate, Navigate } from "react-router-dom";
import KLPSSTLOGO from "./logo_image.png";
// import { routeManager } from "../../routeManager";
import { render } from "@testing-library/react";
import { useAuth } from "../Hooks/AuthProvider";

const KLPSST_Login = ({}) => {
  const { setAuth } = useAuth();

  const storedTheme = localStorage.getItem("theme");
  const initialTheme = storedTheme ? JSON.parse(storedTheme) : "light";

  //redirectiom code
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
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login submitted with:", { username, password });
    const formData = new FormData();
    formData.append("username", username); // Use 'audioFile' as the key for the first file
    formData.append("password", password); // Use 'audioFile' as the key for the second file

    try {
      const response = await fetch("http://localhost:80/users/login", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      // var mydata = JSON.parse(response.json());

      console.log(response);

      if (response.ok) {
        // Authentication successful, handle accordingly (e.g., redirect user)
        response.headers.get("set-cookie");
        // console.log(document.cookie());

        const errorMessage = await response.json();
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        // localStorage.setItem("loggedIn", loggedIn);

        console.log(errorMessage);
        if (errorMessage == "User does not exist") {
          console.log("Login unsuccessful");

          alert(`User does not exist`);
        } else if (errorMessage == "Correct password") {
          setAuth(true);
          console.log("Correct");
          localStorage.setItem("loggedIn", true);
          setRedirect(true); //for redirection?
          alert("Congrats! You're logged in!");
        } else if (errorMessage == "Incorrect password") {
          console.log("Correct Username");
          alert("Wrong Password");
        }
      } else {
        // Authentication failed, handle accordingly (e.g., show error message)
        //   console.error("Login failed");
        const errorMessage = await response.json();
        setMessage(errorMessage.error || "Login failed, try again");
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  if (redirect) {
    console.log(localStorage.getItem("loggedIn"));
    return <Navigate to="/home" />;
  }

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <div className={`login${theme === "dark" ? " dark-mode" : ""}`}>
        <div id="buttons">
          <Button onClick={toggleTheme} id="toggleButton">
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
        </div>
        <Typography variant="h1">Login</Typography>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <button type="submit" className="download-button">Login</button>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default KLPSST_Login;
