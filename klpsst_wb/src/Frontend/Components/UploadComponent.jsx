import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../Hooks/AuthProvider";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import HelpCenterOutlinedIcon from "@mui/icons-material/HelpCenterOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import "./UploadComponent.css";
import PopupModal from "./PopupModal";

// import UploadInstruction from "../../Markdown/UploadInstruction.md";
import MarkdownComponent from "./MarkdownComponent";
import VoiceRecorder from "./VoiceRecorder";

const UploadComponent = ({ onUpload }) => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [greenHighlight, setGreenHighlight] = useState(false);
  const [redHighlight, setRedHighlight] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [allowUpload, setAllowUpload] = useState(false);
  const [openInstruction, setOpenInstruction] = useState(false);
  const { user } = useAuth();

  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let uploadPossible = !uploading && user && audioFiles.length;
    setAllowUpload(uploadPossible);
  }, [uploading, user, audioFiles.length]);

  const addAudioFiles = (files) => {
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

  const addUrlFile = (url, filename) => {
    fetch(url)
      .then((response) => response.blob())
      .then((wavBlob) => {
        // Create a File object from the blob with the desired filename and MIME type
        const wavFile = new File([wavBlob], filename, {
          type: "audio/wav",
        });
        addAudioFiles([wavFile]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renameFile = (originalFile, newName) => {
    return new File([originalFile], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  };

  const handleRename = (index, file, newName) => {
    let newFile = renameFile(file, newName);
    replaceAudioFile(index, newFile);
  };

  // Function to handle file drop
  const handleDrop = (e) => {
    setDragging(false);
    e.preventDefault();

    const url = e.dataTransfer.getData("RecordingURL");
    const filename = e.dataTransfer.getData("RecordingName");
    if (url && filename) {
      addUrlFile(url, filename);
      return;
    }

    var files = [];

    if (e.dataTransfer.items) {
      for (const item of e.dataTransfer.items) {
        if (item.kind === "file") {
          let file = item.getAsFile();
          files.push(file);
        }
      }
    } else {
      files = Array.from(e.dataTransfer.files);
    }

    addAudioFiles(files);
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
    let newFiles = audioFiles.filter((_, i) => i !== index);
    setAudioFiles(newFiles);
    setRedHighlight(null);
  };

  const replaceAudioFile = (index, newFile) => {
    setAudioFiles((prevAudioFiles) => {
      const updatedFiles = [...prevAudioFiles];
      updatedFiles[index] = newFile;
      return updatedFiles;
    });
  };

  const sendFilesToBackend = () => {
    // Create a FormData object to append files
    const formData = new FormData();
    audioFiles.forEach((file, i) => {
      // Use 'audioFile' as the key for the first file
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
          onUpload();
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
            setUploading(false);
            alert(`Error: ${errorData.detail}`);
          },
          (successMessage) => {
            // promise reject (no error) function
            setUploading(false);
            alert(successMessage);
          }
        );
    } catch (error) {
      // Handle network errors
      setUploading(false);
      console.error("Error uploading files:", error);
      alert("In order to upload, please log in!");
    }
  };

  const handleUpload = (event) => {
    event.preventDefault();
    setUploading(true); // Set uploading state to true

    // alert("Upload pressed");
    console.log("Uploading");

    sendFilesToBackend();
  };

  return (
    <div className="UploadComponent">
      {!showContent && (
        <button className="AddFilesButton" onClick={() => setShowContent(true)}>
          <UploadFileIcon />
          <span>Add samples</span>
        </button>
      )}
      {showContent && (
        <>
          <VoiceRecorder
            onAdd={(file) => {
              addAudioFiles([file]);
            }}
          />
          <div className="FileDropBox">
            <label
              htmlFor="file-input2"
              style={{ cursor: "pointer", marginBottom: "0" }}
            >
              <div
                className="DropBoxInfo"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => {
                  setDragging(true);
                }}
                onDragLeave={(e) => {
                  setDragging(false);
                }}
                style={
                  dragging
                    ? {
                        border: "2px solid green",
                        backgroundColor: "rgba(0,255,0,0.1)",
                      }
                    : {}
                }
              >
                <AudioFileOutlinedIcon
                  style={{
                    height: "5ch",
                    width: "5ch",
                    color: "#544caf",
                    filter:
                      "drop-shadow(0.75px 0.75px 0px white) drop-shadow(1.5px 1.5px 0px white)",
                  }}
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

          <ul className="PreviewList">
            {audioFiles.map((file, index) => (
              <li
                key={file.name}
                className="AudioPreview"
                style={{
                  border: greenHighlight
                    ? "2px solid rgb(0,255,0,0.33)"
                    : redHighlight === file.name
                    ? "2px solid rgb(255,0,0,0.33)"
                    : "",
                  backgroundColor: greenHighlight
                    ? "rgb(0,255,0,0.25)"
                    : redHighlight === file.name
                    ? "rgb(255,0,0,0.25"
                    : "",
                }}
              >
                <button
                  className="DeleteButton"
                  title={`Remove ${file.name} from upload list`}
                  onClick={() => removeAudioFile(index)}
                  onMouseEnter={() => setRedHighlight(file.name)}
                  onMouseLeave={() => setRedHighlight(null)}
                >
                  <span>Remove</span>
                  <RemoveCircleOutlineIcon />
                </button>
                <FileNameEditor
                  filename={file.name}
                  onRename={(newName) => {
                    handleRename(index, file, newName);
                  }}
                />
                <audio controls className="AudioPlayer" title={file.name}>
                  <source src={URL.createObjectURL(file)} type={file.type} />
                  Your browser does not support the audio tag.
                </audio>
              </li>
            ))}
          </ul>
          <div className="ButtonGroup">
            <button
              className="InstructionButton"
              onClick={() => setOpenInstruction(true)}
            >
              <HelpCenterOutlinedIcon />
              <span>Instruction</span>
            </button>
            <PopupModal
              open={openInstruction}
              onClose={() => setOpenInstruction(false)}
            >
              <MarkdownComponent name={"UploadInstruction"} />
            </PopupModal>
            <button
              className="UploadButton"
              disabled={!allowUpload}
              style={!allowUpload ? { backgroundColor: "#47474ad4" } : {}}
              onClick={handleUpload}
              onMouseEnter={() => setGreenHighlight(true)}
              onMouseLeave={() => setGreenHighlight(false)}
            >
              <FileUploadOutlinedIcon />
              <span>Upload</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

UploadComponent.propTypes = { onUpload: PropTypes.func.isRequired };

export default UploadComponent;

const FileNameEditor = ({ filename, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [extension, setExtension] = useState("");

  // Split the file name into name and extension
  const lastDotIndex = filename.lastIndexOf(".");
  const name = filename.slice(0, lastDotIndex);
  const ext = filename.slice(lastDotIndex + 1);

  const handleClick = () => {
    setIsEditing(true);
    setNewName(name);
    setExtension(ext);
  };

  const handleChange = (event) => {
    setNewName(event.target.value);
  };

  const confirmRename = () => {
    let nextName = newName;
    if (nextName.length === 0) {
      nextName = name;
      setNewName(nextName);
    }
    setIsEditing(false);
    onRename(`${nextName}.${extension}`);
  };

  const handleBlur = () => {
    // Call onRename function with the new name and extension when blurred
    confirmRename();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Call onRename function with the new name and extension when Enter key is pressed
      confirmRename();
    }
  };

  return (
    <div
      style={{ marginBottom: "1ch", paddingLeft: "1ch", paddingRight: "4ch" }}
    >
      {isEditing ? (
        <input
          type="text"
          value={newName}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            padding: 0,
            paddingLeft: "1ch",
            paddingRight: "1ch",
            margin: 0,
            borderRadius: "1ch",
            width: "-webkit-fill-available",
          }}
        />
      ) : (
        <div onClick={handleClick}>{filename}</div>
      )}
    </div>
  );
};
