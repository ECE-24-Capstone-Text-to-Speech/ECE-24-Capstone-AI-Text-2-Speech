import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useAuth } from "../../Hooks/AuthProvider";
import "./DownloadComponent.css";

const DownloadComponent = (props) => {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const [audioName, setAudioName] = useState(null);

  const handleDownload = () => {
    try {
      setDownloading(true); // Set downloading state to true
      setAudioSrc(null);
      setAudioName(null);
      // console.log("Attempting to download audio file.")
      let filename = "generatedAudio.mp3";
      // Adjust the URL to match the endpoint for downloading files
      const token = sessionStorage.getItem("token");
      fetch(process.env.REACT_APP_SERVER_ADDRESS + `/files/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      })
        .then((res) => {
          // console.log("Fetch successful, decoding packet...")
          setDownloading(false); // Set downloading state to false after download is complete
          if (!res.ok) {
            // Handle server-side errors or other issues
            return Promise.reject("Download failed:" + res.statusText);
          } else {
            const disposition = res.headers.get("Content-Disposition");
            filename = disposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
            if (filename.toLowerCase().startsWith("utf-8''"))
              filename = decodeURIComponent(filename.replace(/utf-8''/i, ""));
            else filename = filename.replace(/['"]/g, "");
            console.log("received file " + filename);
            setAudioName(filename);
            return res.blob();
          }
        })
        .then(
          (blob) => {
            // File downloaded successfully, handle success
            // console.log("Decoded audio file, saving mode")
            // const url = window.URL.createObjectURL(blob);
            // const link = document.createElement("a");
            // link.href = url;
            // link.setAttribute("download", filename);
            // document.body.appendChild(link);
            // link.click();
            // link.remove();
            const audioUrl = URL.createObjectURL(blob);
            setAudioSrc(audioUrl);
          },
          (failMessage) => {
            console.error(failMessage);
            alert(failMessage);
          }
        );
    } catch (error) {
      // Handle network errors
      console.error("Error while downloading file:", error);
      setDownloading(false); // Set downloading state to false after download is complete
    }
  };

  const download = (e) => {
    e.preventDefault();
    console.log("Right click");
    const link = document.createElement("a");
    link.href = audioSrc;
    link.setAttribute("download", audioName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="DownloadComponent">
      <button
        className="DownloadButton"
        disabled={downloading || !user}
        style={downloading || !user ? { backgroundColor: "#47474ad4" } : {}}
        onClick={handleDownload}
      >
        <FileDownloadOutlinedIcon className="DownloadIcon" />
        <span>Check result</span>
      </button>
      {audioName && (
        <div
          className="AudioName"
          onClick={download}
          style={{
            paddingBottom: "4px",
            paddingRight: "1ch",
            paddingLeft: "1ch",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          {audioName}
        </div>
      )}
      {audioSrc && (
        <audio controls className="AudioPlayer" title={audioName}>
          <source src={audioSrc} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

DownloadComponent.propTypes = {};

export default DownloadComponent;
