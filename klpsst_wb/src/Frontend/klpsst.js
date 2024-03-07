import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// import styled from "styled-components";
import "./klpsst.css";
import { useNavigate, Navigate } from "react-router-dom";
import KLPSSTLOGO from "./logo_image.png";
import KLPSST_Login from "./login";
import KLPSST_Bar from "./navbar";
// import { routeManager } from "../../routeManager";
import { render } from "@testing-library/react";
//const backendURL;
import { useAuth } from "../Hooks/AuthProvider";

const KLPSST_Page = () => {
  const { setAuth } = useAuth();
  const { user } = useAuth();

  const storedTheme = localStorage.getItem("theme");
  const initialTheme = storedTheme ? JSON.parse(storedTheme) : "light";
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [file1, setFile1] = useState("");
  const [file2, setFile2] = useState("");
  const [message, setMessage] = useState("");

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

  const handleUpload = (event) => {
    event.preventDefault();
    setUploading(true); // Set uploading state to true

    alert("Upload pressed");
    console.log("Uploading");

    sendFilesToBackend(file1, file2);
    setUploading(false); // Set uploading state to false
    // sendTextToTortoise(inputValue);
  };

  const handleDownload = (event) => {
    try {
      setDownloading(true); // Set downloading state to true
      // console.log("Attempting to download audio file.")
      let filename = "generatedAudio.mp3";
      // Adjust the URL to match the endpoint for downloading files
      fetch(`http://localhost:80/files/download`, {
        credentials: "include",
        method: "GET",
      })
        .then((res) => {
          // console.log("Fetch successful, decoding packet...")
          setDownloading(false); // Set downloading state to false after download is complete
          if (!res.ok) {
            // Handle server-side errors or other issues
            console.error("Download failed:", res.statusText);
          } else {
            const disposition = res.headers.get("Content-Disposition");
            filename = disposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
            if (filename.toLowerCase().startsWith("utf-8''"))
              filename = decodeURIComponent(filename.replace(/utf-8''/i, ""));
            else filename = filename.replace(/['"]/g, "");
            console.log("received file " + filename);
            return res.blob();
          }
        })
        .then((blob) => {
          // File downloaded successfully, handle success
          // console.log("Decoded audio file, saving mode")
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
    } catch (error) {
      // Handle network errors
      console.error("Error while downloading file:", error);
      setDownloading(false); // Set downloading state to false after download is complete
    }
  };

  const handleText = (event) => {
    event.preventDefault();
    //setUploading(true); // Set uploading state to true

    alert("Send Text pressed");
    console.log("Sending");

    sendTextToTortoise(inputValue);

    //setUploading(false); // Set uploading state to false
    // sendTextToTortoise(inputValue);
  };

  const sendFilesToBackend = (file1, file2) => {
    // Create a FormData object to append files
    const formData = new FormData();
    formData.append("audioFiles", file1); // Use 'audioFile' as the key for the first file
    formData.append("audioFiles", file2); // Use 'audioFile' as the key for the second file

    try {
      fetch("http://localhost:80/files/audioInput", {
        credentials: "include",
        method: "POST",
        body: formData,
      })
        .then((response) => {
          return response.ok, response.json();
        })
        .then((responseOk, data) => {
          if (responseOk) {
            // File uploaded successfully, handle success
            alert("Files uploaded successfully.");
          } else {
            // Handle server-side validation errors or other issues
            const errorData = data;
            alert(`Error: ${errorData.detail}`);
          }
        });
      // const response = fetch("http://localhost:80/files/audioInput", {
      //   credentials: "include",
      //   method: "POST",
      //   body: formData,
      // });

      // // const responseData =   response.json();
      // // console.log(responseData);

      // if (response.ok) {
      //   // File uploaded successfully, handle success
      //   alert("Files uploaded successfully.");
      // } else {
      //   // Handle server-side validation errors or other issues
      //   const errorData =   response.json();
      //   alert(`Error: ${errorData.detail}`);
      // }
    } catch (error) {
      // Handle network errors
      console.error("Error uploading files:", error);
      alert("In order to upload, please log in!");
    }
  };

  const sendTextToTortoise = (inputValue) => {
    // Create a FormData object to append files
    // const inputValue = new str();
    // formData.append("audioFile", file1); // Use 'audioFile' as the key for the first file
    // formData.append("audioFile", file2); // Use 'audioFile' as the key for the second file
    // formData.append("strValue", inputValue);

    console.log(localStorage.getItem("username"));
    console.log(localStorage.getItem("password"));
    console.log(localStorage.getItem("loggedIn"));

    try {
      fetch("http://localhost:80/files/toTortoise", {
        credentials: "include",
        method: "POST",
        body: inputValue,
      })
        .then((response) => {
          return response.ok, response.json();
        })
        .then((responseOk, data) => {
          if (responseOk) {
            // File uploaded successfully, handle success
            alert("Text uploaded successfully.");
          } else {
            // Handle server-side validation errors or other issues
            const errorData = data;
            alert(`Error: ${errorData.detail}`);
          }
        });
    } catch (error) {
      // Handle network errors
      console.error("Error uploading Text:", error);
      alert("In order to upload text, please log in!");
    }
  };

  const logOut = (e) => {
    e.preventDefault();

    if (localStorage.getItem("loggedIn") === "true") {
      try {
        const response = fetch("http://localhost:80/users/logout", {
          method: "POST",
          credentials: "include",
        });

        // console.log(response);

        if (response.ok) {
          const errorMessage = response.json();
          localStorage.setItem("username", "");
          localStorage.setItem("password", "");

          console.log(errorMessage);
          if (errorMessage == "Error: No user in session to logout") {
            console.log("Naur");
            alert(`Logout unsucessful`);
          } else if (errorMessage == "User successfully logged out") {
            setAuth(false);
            console.log("Yer");
            localStorage.setItem("loggedIn", false);
            setRedirect(true); //for redirection?
            alert("User successfully logged out");
          }
        } else {
          const errorMessage = response.json();
          setMessage(errorMessage.error || "Logout failed");
          alert(errorMessage);
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("An error occurred. Please try again later.");
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
        <button onClick={handleText}>Send Text</button>

        <label htmlFor="fileInput1">Upload File 1:</label>
        <input type="file" id="fileInput" onChange={handleFile1Change} />
        <br />

        <label htmlFor="fileInput1">Upload File 2:</label>
        <input type="file" id="fileInput1" onChange={handleFile2Change} />
        <br />
        {user ? (
          <b>
            <input
              type={`submit${uploading ? "-disabled" : ""}`}
              value="Upload"
              onClick={handleUpload}
              disabled={uploading}
            />
            <button
              type={`download${downloading ? "-disabled" : ""}`}
              onClick={handleDownload}
              className={`download-button${downloading ? "-disabled" : ""}`}
              disabled={downloading}
            >
              Download
            </button>
            {/* <a href="http://localhost:80/files/download" download>
              DOWNLOAD
            </a> */}
          </b>
        ) : (
          <b>
            <input type="submit-disabled" disabled value="Upload" />
            <button
              type="download-disabled"
              disabled
              className="download-button-disabled"
            >
              Download
            </button>
          </b>
        )}
        {/* <button type="download"  onClick={handleDownload} className="download-button" >
            Download
          </button> */}
        <h3>Please submit 2 .wav files, each about 6 seconds long</h3>
        <p id="fileName"></p>
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
