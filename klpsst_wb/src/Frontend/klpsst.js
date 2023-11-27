import React, { useState } from "react";
import "./klpsst.css";
import KLPSSTLOGO from "./logo_image.png";

import { Amplify } from 'aws-amplify';
import { uploadData } from 'aws-amplify/storage';
import awsmobile from "./aws-exports"; // Make sure to configure aws-exports.js
Amplify.configure(awsmobile);

const KLPSST_Page = () => {
  const [inputValue, setInputValue] = useState('');
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFile1Change = (event) => {
    setFile1(event.target.files[0]);
  };

  const handleFile2Change = (event) => {
    setFile2(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Call the function to upload files to the backend
    await sendFilesToBackend(file1, file2);

    // Add any additional logic or redirection after the files are uploaded
  };

  const sendFilesToBackend = async (file1, file2) => {
    const formData = new FormData();
    formData.append('audioFile', file1); // Use 'audioFile' as the key for the first file
    formData.append('audioFile2', file2); // Use 'audioFile' as the key for the second file

    try {
      const response = await fetch('http://localhost:80/files/audioInput/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Handle the response from the backend
      // You may want to update the UI based on the backend's response
    } catch (error) {
      console.error('Error uploading audio files:', error);
    }
  };

  return (
    <div id="homepage">
      <h1>KLPSST</h1>
      <img src={KLPSSTLOGO} alt="logo" style={{ width: '168px', height: '168px' }} />
      <form onSubmit={handleFormSubmit}>
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

        <label htmlFor="fileInput">Upload File 1:</label>
        <input type="file" id="fileInput" onChange={handleFile1Change} />
        <br />

        <label htmlFor="fileInput1">Upload File 2:</label>
        <input type="file" id="fileInput1" onChange={handleFile2Change} />
        <br />

        <input type="submit" value="Done" />
      </form>

      <h3>Please submit 2 .wav or .mp3 files, each about 6 seconds long</h3>

      <p id="fileName"></p>
    </div>
  );
};
const S3UploadPage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Use a unique key for each file to avoid overwrites
    const filename = `audioFiles/${Date.now()}_${file.name}`;

    try {
      const result = await uploadData({
        key: filename,
        data: file,
        options: {
          accessLevel: 'guest', // defaults to `guest` but can be 'private' | 'protected' | 'guest'
          //onProgress // Optional progress callback.
        }
      }).result;
      console.log('Succeeded: ', result);
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  return (
    <div>
      <h1>S3 File Upload</h1>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="fileInput">Upload File:</label>
        <input type="file" id="fileInput" onChange={handleFileChange} />
        <br />
        <input type="submit" value="Upload to S3" />
      </form>
    </div>
  );
};

export { KLPSST_Page, S3UploadPage };
