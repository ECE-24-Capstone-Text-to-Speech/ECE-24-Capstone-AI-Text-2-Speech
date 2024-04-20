import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./AudioTab.css";

const AudioTab = ({ key, fileName, onDelete }) => {
  const [audioSrc, setAudioSrc] = useState(null);
  const [audioSize, setAudioSize] = useState(-1);
  const [showDeleteButton, setShowDeleteButton] = useState(true);
  const [redHighlight, setRedHighlight] = useState(false);

  useEffect(() => {
    // Fetch audio file from API
    fetchAudio();
  }, [fileName]);

  const showError = (error) => {
    if (error.response) {
      error.response.json().then((data) => {
        console.error("Error:", data.detail);
        alert(`Failed to fetch ${fileName}\n${data.detail}`);
      });
    } else {
      console.error("Fetch error: " + error);
    }
  };

  const fetchAudio = () => {
    const token = sessionStorage.getItem("token");
    fetch(process.env.REACT_APP_SERVER_ADDRESS + `/files/audios/${fileName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch audio");
        }
        return response.blob();
      })
      .then((audioBlob) => {
        // Convert blob to URL
        let size = Math.round(audioBlob?.size / 1024);
        size = isNaN(size) ? 0 : size;
        setAudioSize(size);

        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioSrc(audioUrl);
      })
      .catch((error) => {
        showError(error);
      });
  };

  const deleteAudio = () => {
    const token = sessionStorage.getItem("token");
    fetch(
      process.env.REACT_APP_SERVER_ADDRESS +
        `/files/delete/audios` +
        "?" +
        new URLSearchParams({ name: fileName }),
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete audio");
        }
        return response.json();
      })
      .then((data) => {
        // delete successful
        console.log(data.message);
        onDelete(fileName);
      })
      .catch((error) => {
        // delete unsuccessful
        showError(error);
      });
  };

  const deleteThisFile = () => {
    // Add delete logic here
    console.log("Delete button clicked");
    deleteAudio();
    // onDelete(fileName);
  };

  return (
    <li
      className="AudioTab"
      key={key}
      // onMouseEnter={() => {
      //   setShowDeleteButton(true);
      // }}
      // onMouseLeave={() => {
      //   setShowDeleteButton(false);
      // }}
      style={{
        border: redHighlight
          ? "2px solid rgba(255,0,0,0.33)"
          : "2px solid rgba(255,255,255,0.0)",
        backgroundColor: redHighlight ? "rgba(255,0,0,0.25)" : "",
      }}
    >
      {showDeleteButton && (
        <button
          className="DeleteButton"
          title={`Delete ${fileName} forever`}
          onClick={deleteThisFile}
          onMouseEnter={() => {
            setRedHighlight(true);
          }}
          onMouseLeave={() => {
            setRedHighlight(false);
          }}
        >
          <span>Delete</span>
          <DeleteForeverIcon />
        </button>
      )}
      <div className="FileInfo">
        {/* <span>{fileName}</span> */}
        <a
          className="AudioFile"
          href={audioSrc}
          download={fileName}
          title={`Download ${fileName} | ${audioSize.toLocaleString()} KB`}
        >
          {fileName}
        </a>
      </div>
      {audioSrc && (
        <audio controls className="AudioPlayer">
          <source src={audioSrc} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </li>
  );
};

AudioTab.propTypes = {
  key: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AudioTab;
