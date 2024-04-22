import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AudioTab from "./AudioTab";
import "./FileManager.css";
import UploadComponent from "./UploadComponent";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";

const FileManager = (props) => {
  const [files, setFiles] = useState([]);
  const [folded, setFolded] = useState(true);
  const [getAudioList, setGetAudioList] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

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
        setErrorMsg(data.detail);
        alert(`Failed to fetch audio list\n${data.detail}`);
      });
    } else {
      console.error("Fetch error: " + error);
      // setErrorMsg(JSON.stringify(error, Object.getOwnPropertyNames(error)));
      setErrorMsg("Cannot fetch list of audios, please retry");
    }
  };

  const fetchAudioList = () => {
    setLoadingList(true);
    const token = sessionStorage.getItem("token");
    fetch(process.env.REACT_APP_SERVER_ADDRESS + `/files/audios`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // get a new list always, never cache
    })
      .then((response) => {
        setLoadingList(false);
        if (!response.ok) {
          throw new Error("Failed to fetch audio");
        }
        return response.json();
      })
      .then((audioList) => {
        // Convert blob to URL
        console.log("Fetch list of audios: " + audioList);
        setErrorMsg(null);
        setFiles(audioList);
      })
      .catch((error) => {
        // something wrong with the list
        setLoadingList(false);
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
          setGetAudioList(folded && true); // get new list when unfolding
          setErrorMsg(null);
          setFolded(!folded);
        }}
        // style={{ borderBottom: folded ? "none" : "1.5px solid gray" }}
      >
        <span>{folded ? "▹" : "▾"}</span>
        <span> My samples</span>
      </div>
      {!folded && (
        <div
          className="DivideLine"
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            borderTop: "1.5px solid grey",
          }}
        />
      )}
      {!folded && (
        <div className="FileManagerContent">
          {files.length ? (
            <ul className="AllFiles">
              {files.map((fileName) => (
                <AudioTab
                  key={fileName}
                  fileName={fileName}
                  onDelete={deleteTab}
                />
              ))}
            </ul>
          ) : loadingList ? (
            <div style={{ cursor: "progress" }}>Loading list...</div>
          ) : errorMsg ? (
            <div
              style={{
                backgroundColor: "rgba(255, 0, 0, 0.333)",
                color: "white",
                fontWeight: "bold",
                borderRadius: "1ch",
                padding: "1ch",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <DangerousOutlinedIcon style={{ marginRight: "7px" }} />
              {errorMsg}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "rgba(255, 255, 120, 0.5)",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontWeight: "bold",
                borderRadius: "1ch",
                padding: "1ch",
                marginBottom: "10px",
              }}
            >
              <ReportOutlinedIcon style={{ marginRight: "7px" }} />
              No files found, please record and upload some wav files
            </div>
          )}
          <div
            className="DivideLine"
            style={{
              borderTop: "1.5px solid grey",
            }}
          />
          <UploadComponent onUpload={() => setGetAudioList(true)} />
        </div>
      )}
    </div>
  );
};

FileManager.propTypes = {};

export default FileManager;
