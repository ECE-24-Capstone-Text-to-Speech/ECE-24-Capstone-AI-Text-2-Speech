import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// import styled from "styled-components";
import "./klpsst.css";
import { Navigate, redirect } from "react-router-dom";
import KLPSSTLOGO from "./logo_image.png";
// import { routeManager } from "../../routeManager";
import { render } from "@testing-library/react";
//const backendURL;

const KLPSST_Page = () => {
  const storedTheme = localStorage.getItem("theme");
  const initialTheme = storedTheme ? JSON.parse(storedTheme) : "light";
  const [file1, setFile1] = useState("");
  const [file2, setFile2] = useState("");

  // Define dark mode theme
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // console.log("dsfyyus");
  // console.log(localStorage.getItem("loggedIn"));

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

  // Define a state variable to store the input's value
  const [inputValue, setInputValue] = useState("");

  // Create an event handler function to update the input value
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFile1Change = (event) => {
    setFile1(event.target.files[0]);
  };

  const handleFile2Change = (event) => {
    setFile2(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    await sendFilesToBackend(file1, file2);

    //additional logic
  };

  const handleDownload = async (event) => {
    try {
      // Adjust the URL to match the endpoint for downloading files
      const response = await fetch(`http://localhost:80/files/download`, {
        credentials: "include",
        method: "GET",
      });
      if (response.ok) {
        // File downloaded successfully, handle success
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "tortoisegeneration.mp3");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        // Handle server-side errors or other issues
        console.error("Failed to download file:", response.statusText);
      }
    } catch (error) {
      // Handle network errors
      console.error("Error downloading file:", error);
    }
  };

  const sendFilesToBackend = async (file1, file2) => {
    // Create a FormData object to append files
    const formData = new FormData();
    formData.append("audioFile", file1); // Use 'audioFile' as the key for the first file
    formData.append("audioFile", file2); // Use 'audioFile' as the key for the second file

    console.log(localStorage.getItem("username"));
    console.log(localStorage.getItem("password"));
    console.log(localStorage.getItem("loggedIn"));

    try {
      const response = await fetch("http://localhost:80/files/audioInput", {
        credentials: "include",
        method: "POST",
        body: formData,
      });

      // const responseData = await response.json();
      // console.log(responseData);

      if (response.ok) {
        // File uploaded successfully, handle success
        alert("Files uploaded successfully.");
      } else {
        // Handle server-side validation errors or other issues
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      // Handle network errors
      console.error("Error uploading files:", error);
    }
  };

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <div id="homepage" className={theme === "dark" ? "dark-mode" : ""}>
        <Button onClick={toggleTheme} id="toggleButton">
          {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
        <Typography variant="h1">KLPSST</Typography>
        <img
          src={KLPSSTLOGO}
          alt="logo"
          style={{ width: "168px", height: "168px" }}
        />
        <form onSubmit={handleUpload}>
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

          <label htmlFor="fileInput1">Upload File 1:</label>
          <input type="file" id="fileInput" onChange={handleFile1Change} />
          <br />

          <label htmlFor="fileInput1">Upload File 2:</label>
          <input type="file" id="fileInput1" onChange={handleFile2Change} />
          <br />

          <input type="submit" value="Upload" />
        </form>
        <form>
          <button type="download" onClick={handleDownload}>
            Download
          </button>
        </form>
        <h3>Please submit 2 .wav or .mp3 files, each about 6 seconds long</h3>
        <p id="fileName"></p>
      </div>
    </ThemeProvider>
  );
};

export default KLPSST_Page;
