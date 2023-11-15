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
//const backendURL;

const KLPSST_Page = () => {
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

  // Define a state variable to store the input's value
  const [inputValue, setInputValue] = useState('');

  // Create an event handler function to update the input value
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleUpload = async () => {
    const fileInput = document.getElementById("fileInput");
    const fileInput1 = document.getElementById("fileInput1");

    const uploadEndpoint = "http://localhost/files/audioInput"; // check if right

     // Create a FormData object to append files
     const formData = new FormData();
     formData.append("file1", fileInput.files[0]);
     formData.append("file2", fileInput1.files[0]);
 
     try {
       const response = await fetch(uploadEndpoint, {
         method: "POST",
         body: formData,
       });
 
       if (response.ok) {
         // File uploaded successfully, handle success
         alert("Files uploaded successfully.");
       } else {
         // Handle server-side validation errors or other issues
         const errorData = await response.json();
         alert(`Error: ${errorData.error}`);
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
        <img src={KLPSSTLOGO} alt="logo" style={{width: '168px', height: '168px'}}/>
        <form>
          {/* <label for="userInput">Type a sentence:</label>
          <input type="text" id="userInput" name="userInput" placeholder="sentence" required> <input />
          
          <input type="submit" value="Done"> <input /> */}
          <label for="userInput" style={{textAlign:"left"}}>Type a sentence:</label>
          <input type="text" id="userInput" name="userInput" placeholder="sentence"
              value={inputValue} // Bind the input's value to the state variable
              onChange={handleInputChange} // Call the event handler when the input changes
          />
          <p>You typed: {inputValue}</p>
          <input type="submit" value="Done"></input>
          </form>

          <h3>Please submit 2 .wav or .mp3 files, each about 6 seconds long</h3>

          <input type="file" id="fileInput"/>

          <input type="file" id="fileInput1" />

          <button onClick={handleUpload}>Upload File</button> 
      
          <p id="fileName"></p>
      </div>
    </ThemeProvider>
  );
}

export default KLPSST_Page;