import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import styled from "styled-components";
import "./register.css";
import { Navigate, redirect } from "react-router-dom";
import KLPSSTLOGO from "./logo_image.png";
// import { routeManager } from "../../routeManager";
import { render } from "@testing-library/react";

const KLPSST_Register = ({}) => {
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
      const response = await fetch("http://localhost:80/users/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Authentication successful, handle accordingly (e.g., redirect user)
        console.log("Login successful");
      } else {
        // Authentication failed, handle accordingly (e.g., show error message)
        //   console.error("Login failed");
        const errorMessage = await response.json();
        setMessage(errorMessage.error || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <div id="login" className={theme === "dark" ? "dark-mode" : ""}>
        <Button onClick={toggleTheme} id="toggleButton">
          {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
        <Typography variant="h1">Register</Typography>
        <form onSubmit={handleSubmit}>
          <label>
            Create a Username:
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </label>
          <label>
            Create a Password:
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <button type="submit">Enter</button>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default KLPSST_Register;
