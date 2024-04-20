import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../Hooks/AuthProvider";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import "./UploadComponent.css";

const UploadComponent = (props) => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  // Function to handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    // Filter only .wav audio files
    const wavFilesToAdd = files.filter((file) => file.type === "audio/wav");

    // Check if the file already exists in the list
    const uniqueWavFiles = wavFilesToAdd.filter(
      (file) =>
        !audioFiles.some((existingFile) => existingFile.name === file.name)
    );

    // Warn about duplicates
    const duplicates = wavFilesToAdd.length - uniqueWavFiles.length;
    if (duplicates > 0) {
      alert(`Ignored ${duplicates} duplicate files.`);
    }

    // Warn about non-.wav files
    const nonWavFiles = files.filter((file) => !wavFilesToAdd.includes(file));
    nonWavFiles.forEach((file) => {
      alert(`File '${file.name}' is not a .wav file and has been ignored.`);
    });

    // Add unique files to the state
    setAudioFiles((prevFiles) => [...prevFiles, ...uniqueWavFiles]);
  };

  // Function to handle file input change
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    // Filter only .wav audio files
    const wavFilesToAdd = files.filter((file) => file.type === "audio/wav");

    // Check if the file already exists in the list
    const uniqueWavFiles = wavFilesToAdd.filter(
      (file) =>
        !audioFiles.some((existingFile) => existingFile.name === file.name)
    );

    // Warn about duplicates
    const duplicates = wavFilesToAdd.length - uniqueWavFiles.length;
    if (duplicates > 0) {
      alert(`Ignored ${duplicates} duplicate files.`);
    }

    // Warn about non-.wav files
    const nonWavFiles = files.filter((file) => !wavFilesToAdd.includes(file));
    nonWavFiles.forEach((file) => {
      alert(`File '${file.name}' is not a .wav file and has been ignored.`);
    });

    // Add unique files to the state
    setAudioFiles((prevFiles) => [...prevFiles, ...uniqueWavFiles]);
  };

  // Function to remove an audio file
  const removeAudioFile = (index) => {
    console.log(audioFiles);
    console.log("removing file with index=" + index);
    let newFiles = audioFiles.filter((_, i) => i !== index);
    console.log(newFiles);
    setAudioFiles(newFiles);
  };

  const sendFilesToBackend = () => {
    // Create a FormData object to append files
    const formData = new FormData();
    audioFiles.forEach((file, i) => {
      // Use 'audioFile' as the key for the first file
      console.log("adding file " + i + ": " + file.name);
      formData.append("audioFiles", file);
    });

    try {
      const token = sessionStorage.getItem("token");
      fetch(process.env.REACT_APP_SERVER_ADDRESS + "/files/audioInput", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          // if error present then fullfill promise else reject promise
          if (response.ok) {
            return Promise.reject("Files uploaded successfully.");
          } else {
            return response.json();
          }
        })
        .then(
          (errorData) => {
            // promise fullfill (error present) function
            // Handle server-side validation errors or other issues
            alert(`Error: ${errorData.detail}`);
          },
          (successMessage) => {
            // promise reject (no error) function
            alert(successMessage);
            setUploading(false); // Set uploading state to false
          }
        );
    } catch (error) {
      // Handle network errors
      console.error("Error uploading files:", error);
      alert("In order to upload, please log in!");
    }
  };

  const handleUpload = (event) => {
    event.preventDefault();
    setUploading(true); // Set uploading state to true

    alert("Upload pressed");
    console.log("Uploading");

    sendFilesToBackend();
  };

  return (
    <div className="UploadComponent">
      <div className="FileDropBox">
        <label
          htmlFor="file-input2"
          style={{ cursor: "pointer", marginBottom: "0" }}
        >
          <div
            className="DropBoxInfo"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <AudioFileIcon
              style={{ height: "5ch", width: "5ch", color: "#544caf" }}
            />
            <h3 style={{ margin: "0.5ch" }}>Drag a file here, or</h3>
            <span style={{ color: "#544caf", fontWeight: "bold" }}>
              Choose a file to upload
            </span>
            <span>File type permitted: WAV</span>
            <input
              id="file-input2"
              type="file"
              accept="audio/wav"
              style={{ display: "none" }}
              onChange={handleFileInputChange}
              multiple
            />
          </div>
        </label>
      </div>

      {audioFiles.map((file, index) => (
        <div key={file.name}>
          {file.name}
          <audio controls>
            <source src={URL.createObjectURL(file)} type={file.type} />
            Your browser does not support the audio tag.
          </audio>
          <button onClick={() => removeAudioFile(index)}>Remove</button>
        </div>
      ))}
      <b>
        <button
          className="UploadButton"
          onClick={handleUpload}
          disabled={uploading || !user}
          style={uploading || !user ? { backgroundColor: "#47474ad4" } : {}}
        >
          <FileUploadIcon />
          <span>Upload</span>
        </button>
      </b>
    </div>
  );
};

UploadComponent.propTypes = {};

export default UploadComponent;
