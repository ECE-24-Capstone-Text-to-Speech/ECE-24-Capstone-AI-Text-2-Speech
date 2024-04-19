import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AudioTab from "./AudioTab";
import "./FileManager.css";

const fake_files = ["anthony1.wav", "anthony2.wav"];

const FileManager = (props) => {
  const [files, setFiles] = useState([]);
  const [folded, setFolded] = useState(true);
  const [getAudioList, setGetAudioList] = useState(false);

  useEffect(() => {
    // setFiles(fake_files);
  }, []);

  useEffect(() => {
    if (getAudioList) {
      setGetAudioList(false);
      fetchAudioList();
    }
  }, [getAudioList]);

  const showError = (error) => {
    if (error.response) {
      error.response.json().then((data) => {
        console.error("Error:", data.detail);
        alert(`Failed to fetch audio list\n${data.detail}`);
      });
    } else {
      console.error("Fetch error: " + error);
    }
  };

  const fetchAudioList = () => {
    const token = sessionStorage.getItem("token");
    fetch(process.env.REACT_APP_SERVER_ADDRESS + `/files/audios`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // get a new list always, never cache
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch audio");
        }
        return response.json();
      })
      .then((audioList) => {
        // Convert blob to URL
        console.log("Fetch list of audios: " + audioList);
        setFiles(audioList);
      })
      .catch((error) => {
        // something wrong with the list
        showError(error);
      });
  };

  const deleteTab = (fileName) => {
    console.log("Deleting audio file:", fileName);
    // Filter out the deleted fileName from the list
    const updatedFiles = files.filter((file) => file !== fileName);
    setFiles(updatedFiles);
  };

  return (
    <div className="AudioFilesManager">
      <div
        className="FileListInfo"
        onClick={() => {
          setFolded(!folded);
          setGetAudioList(true);
        }}
        style={{ borderBottom: folded ? "none" : "1px solid #ccc" }}
      >
        <span>{folded ? "▹" : "▾"}</span>
        <span> My files</span>
      </div>
      {!folded && (
        <ul className="AllFiles">
          {files.map((fileName) => (
            <AudioTab key={fileName} fileName={fileName} onDelete={deleteTab} />
          ))}
        </ul>
      )}
    </div>
  );
};

FileManager.propTypes = {};

export default FileManager;
