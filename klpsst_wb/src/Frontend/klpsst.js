import React, {useState, useEffect} from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// import styled from "styled-components";
import "./klpsst.css";
import { Navigate, redirect } from "react-router-dom";
import KLPSSTLOGO from "./logo_image.png"
// import { routeManager } from "../../routeManager";
import { render } from "@testing-library/react";
//import { Amplify } from 'aws-amplify';
//import { uploadData } from 'aws-amplify/storage';
//import awsmobile from "./aws-exports"; // Make sure to configure aws-exports.js
//Amplify.configure(awsmobile);
//const backendURL;

const KLPSST_Page = () => {
  const storedTheme = localStorage.getItem("theme");
  const initialTheme = storedTheme ? JSON.parse(storedTheme) : "light";
  const [file1, setFile1] = useState('');
  const [file2, setFile2] = useState('');
  const [inputValue, setInputValue] = useState('');


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



  const sendFilesToBackend = async (file1, file2) => {
    // Create a FormData object to append files
    const formData = new FormData();
    formData.append('audioFile', file1); // Use 'audioFile' as the key for the first file
    formData.append('audioFile2', file2); // Use 'audioFile' as the key for the second file

    try {
      const response = await fetch('http://localhost:80/files/audioInput/upload', {
        method: 'POST',
        body: formData,
      });

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
        <img src={KLPSSTLOGO} alt="logo" style={{ width: '168px', height: '168px' }} />
        <form onSubmit={handleUpload}>         
            <label htmlFor="userInput" style={{ textAlign: "left" }}>Type a sentence:</label>
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

        <h3>Please submit 2 .wav or .mp3 files, each about 6 seconds long</h3>
        <p id="fileName"></p>
        </div>
    </ThemeProvider>
  );
};

export default KLPSST_Page;