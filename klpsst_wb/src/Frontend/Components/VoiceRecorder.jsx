import React, { useState, useRef, useEffect } from "react";
import Recorder from "recorder-js";
import WaveStream from "react-wave-stream";
import PropTypes from "prop-types";
import "./VoiceRecorder.css";

const RECORD_MAX_SIZE_KB = 10_000;

const VoiceRecorder = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // New state for elapsed time
  const recorder = useRef(null);
  const stream = useRef(null);

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
          // console.log(data);
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
        console.log("Saving audio blob");
        setAudioBlob(blob);
        // buffer is an AudioBuffer
        console.log("turning mic off");
        const tracks = stream.current.getTracks();
        // When all tracks have been stopped the stream will
        // no longer be active and release any permissioned input
        tracks.forEach((track) => {
          console.log("stopping track: " + track);
          track.stop();
        });
        console.log("Mic should be off now");
      });
      console.log("Recorder stopped, ready to be downloaded...");
      setIsRecording(false);
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };

  const downloadRecord = () => {
    console.log("Downloading recent recording");
    Recorder.download(audioBlob, "my-audio-file"); // downloads a .wav file
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

  return (
    <div className="VoiceRecorder">
      <p>Recorder:</p>
      <div className="VR-Buttons">
        {isRecording ? (
          <button onClick={stopRecord}>Stop record</button>
        ) : (
          <button onClick={startRecord}>Start record</button>
        )}

        {audioBlob && (
          <button onClick={downloadRecord} disabled={!audioBlob}>
            Download Recording
          </button>
        )}
      </div>
      <div className="RecordPreview">
        {audioBlob && (
          <audio controls className="AudioPlayer">
            <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
      <div className="Wavestream">
        {isRecording && <WaveStream {...analyserData} />}
      </div>
      <div className="Info" style={{ textAlign: "center" }}>
        {formatTime()} | {formatSize()}
      </div>
    </div>
  );
};

VoiceRecorder.propTypes = {};

export default VoiceRecorder;
