import React, { useState, useRef, useEffect } from "react";
import Recorder from "recorder-js";
import WaveStream from "react-wave-stream";
import PropTypes from "prop-types";
import "./VoiceRecorder.css";

import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AddIcon from "@mui/icons-material/Add";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";

const RECORD_MAX_SIZE_KB = 10_000;

const VoiceRecorder = ({ onAdd }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // New state for elapsed time
  const recorder = useRef(null);
  const stream = useRef(null);

  const [audioURL, setAudioURL] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const [analyserData, setAnalyserData] = useState({ data: [], lineTo: 0 });

  const startRecord = async () => {
    try {
      // Request microphone access
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // clear cache
      setAudioBlob(null);

      // Start recording
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      recorder.current = new Recorder(audioContext, {
        onAnalysed: (data) => {
          setAnalyserData(data);
        },
      });
      await recorder.current.init(stream.current);
      await recorder.current.start();
      console.log("recording started");
      setElapsedTime(0);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecord = () => {
    try {
      // Stop recording
      console.log("STOPPING RECORD");
      recorder.current.stop().then(({ blob, _buffer }) => {
        setAudioBlob(blob);
        console.log(blob);
        // buffer is an AudioBuffer
        const tracks = stream.current.getTracks();
        // When all tracks have been stopped the stream will
        // no longer be active and release any permissioned input
        tracks.forEach((track) => {
          track.stop();
        });
      });
      setIsRecording(false);
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };

  const downloadRecord = () => {
    console.log("Downloading recent recording");
    Recorder.download(audioBlob, "my-audio-file"); // downloads a .wav file
  };

  const moveToUploadList = () => {
    if (!audioBlob) {
      alert("No audios record found!");
      return;
    }
    if (!onAdd) {
      alert("Can't add this file!");
      return;
    }
    console.log("Moving this audio blob to upload list");
    onAdd(audioFile);
  };

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 0.01);
      }, 10); // Update elapsed time every 10ms
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    if (audioBlob) {
      console.log("Converting audio blob to audio file...");
      // Create a URL for the blob
      const blobURL = URL.createObjectURL(audioBlob);
      setAudioURL(blobURL);

      const currTime = new Date();
      let Year = currTime.getFullYear();
      let Month = currTime.getMonth() + 1;
      let Day = currTime.getDate();
      let Hour = currTime.getHours();
      let Minute = currTime.getMinutes();
      let Second = currTime.getSeconds();
      let Milisecond = currTime.getMilliseconds();

      const fileName = `me_${Year}-${Month}-${Day}_${Hour}:${Minute}:${Second}.wav`;

      // Fetch the blob content
      fetch(blobURL)
        .then((response) => response.blob())
        .then((wavBlob) => {
          // Create a File object from the blob with the desired filename and MIME type
          const wavFile = new File([wavBlob], fileName, {
            type: "audio/wav",
          });
          setAudioFile(wavFile);
          console.log("Done");
          console.log(wavFile);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [audioBlob]);

  const formatTime = () => {
    // time in seconds with 3 decimal places
    return <span>{`${elapsedTime.toFixed(2)} seconds`}</span>;
  };

  const formatSize = () => {
    // size of recording when done
    let sizeKB = Math.round(audioBlob?.size / 1024);
    let okSize = sizeKB < RECORD_MAX_SIZE_KB && !isNaN(sizeKB);
    let style = {
      color: okSize ? "inherit" : "red", // Set color to red if size exceeds 10000KB
      fontWeight: okSize ? "inherit" : "bold",
    };

    return (
      <span style={style}>{`${
        isRecording ? "Recording..." : `${sizeKB.toLocaleString()} KB`
      }`}</span>
    );
  };

  const handleDrag = (e, widgetData) => {
    console.log("Started dragging widget");
    e.dataTransfer.setData("widgetType", widgetData);
  };

  const handleDrop = (e) => {
    const widgetType = e.dataTransfer.getData("widgetType");
    console.log("Dropped widget ");
    console.log(widgetType);
    // moveToUploadList();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="VoiceRecorder">
      <div className="VR-Buttons">
        {isRecording ? (
          <button onClick={stopRecord}>
            <StopCircleOutlinedIcon />
            <span>Stop record</span>
          </button>
        ) : audioBlob ? (
          <button onClick={startRecord}>
            <RestartAltIcon />
            <span>Record again</span>
          </button>
        ) : (
          <button className="RecordTabButton" onClick={startRecord}>
            <KeyboardVoiceIcon />
            <span>Record my own (Start recording)</span>
          </button>
        )}

        {/* {audioBlob && (
          <button onClick={downloadRecord} disabled={!audioBlob}>
            Save
          </button>
        )} */}
        {audioBlob && (
          <button onClick={moveToUploadList} disabled={!audioBlob}>
            <AddIcon />
            <span>Add</span>
          </button>
        )}
      </div>
      <div
        className="RecordPreview"
        draggable
        onDragStart={(e) => handleDrag(e, [audioFile])}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e)}
      >
        {audioBlob && (
          <audio controls className="AudioPlayer">
            <source src={audioURL} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
      <div className="Wavestream">
        {isRecording && <WaveStream {...analyserData} />}
      </div>
      {(audioBlob || isRecording) && (
        <div className="Info" style={{ textAlign: "center" }}>
          {formatTime()} | {formatSize()}
        </div>
      )}
    </div>
  );
};

VoiceRecorder.propTypes = { onAdd: PropTypes.func.isRequired };

export default VoiceRecorder;
