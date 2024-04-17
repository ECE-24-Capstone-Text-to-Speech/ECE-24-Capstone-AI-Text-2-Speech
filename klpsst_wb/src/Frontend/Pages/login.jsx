import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./login.css";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../Hooks/AuthProvider";

const KLPSST_Login = ({}) => {
  const { setAuth } = useAuth();
  // const { store, sctions }

  const storedTheme = localStorage.getItem("theme");
  const initialTheme = storedTheme ? JSON.parse(storedTheme) : "light";

  //redirectiom code
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);
  // const token = sessionStorage.getItem("token");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login submitted with:", { username, password });
    const formData = new FormData();
    formData.append("username", username); // Use 'audioFile' as the key for the first file
    formData.append("password", password); // Use 'audioFile' as the key for the second file

    try {
      fetch(process.env.REACT_APP_SERVER_ADDRESS + "/users/login", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          //get JSOn file data from repsonse
          return res.json();
        })

        .then((data) => {
          console.log("from backend", data);
          if (data.message == "Correct password") {
            sessionStorage.setItem("token", data.access_token);
            console.log("Correct");
            localStorage.setItem("loggedIn", true);
            setAuth(true);
            setRedirect(true); //for redirection?
            alert("Congrats! You're logged in!");
          } else {
            if (data.message == "User does not exist") {
              console.log("Login unsuccessful");
              alert(`User does not exist`);
            }
            if (data.message == "Incorrect password") {
              console.log("Correct Username, Wrong password");
              alert("Wrong Password");
            }
          }
          console.log(data.message);
          // setStore({ token: data.token })
        });
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
          <Button
            onClick={toggleTheme}
            id="toggleButton"
            className="narrow-button"
          >
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
          <button type="submit" className="download-button">
            Login
          </button>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default KLPSST_Login;
