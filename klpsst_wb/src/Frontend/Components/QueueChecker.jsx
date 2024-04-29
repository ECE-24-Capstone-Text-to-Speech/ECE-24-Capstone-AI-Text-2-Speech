import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { colors } from "@mui/material";
import OutboxOutlinedIcon from "@mui/icons-material/OutboxOutlined";

const DEFAULT_QUEUE_INFO = {
  queueLength: 0,
  userCount: 0,
  currentIndex: 0,
};

const STATUS = {
  IDLE: 0,
  WAITING: 1,
  PROCESSING: 2,
  DONE: 3,
};

const PEEK_INTERVAL_MS = 1_500;

const QueueChecker = ({ text }) => {
  const [queueInfo, setQueueInfo] = useState(DEFAULT_QUEUE_INFO);
  const [jobStatus, setJobStatus] = useState(STATUS.IDLE);
  const [peek, setPeek] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleText = (event) => {
    event.preventDefault();
    console.log("Sending");
    sendTextToTortoise(text);
  };

  const sendTextToTortoise = (inputValue) => {
    // Create a FormData object to append files
    // const inputValue = new str();
    // formData.append("strValue", inputValue);

    console.log(localStorage.getItem("username"));
    console.log(localStorage.getItem("password"));
    console.log(localStorage.getItem("loggedIn"));

    try {
      const token = sessionStorage.getItem("token");
      fetch(process.env.REACT_APP_SERVER_ADDRESS + "/files/toTortoise", {
        method: "POST",
        body: inputValue,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((message) => {
          if (message) alert(message);
          setPeek(true);
          setShowInfo(true);
        });
    } catch (error) {
      // Handle network errors
      console.error("Error uploading Text:", error);
      alert("In order to upload text, please log in!");
    }
  };

  useEffect(() => {
    console.log("moved up");
    if (queueInfo.currentIndex == 0) {
      console.log("Your job is being processed right now!");
      setJobStatus(STATUS.PROCESSING);
    } else if (queueInfo.currentIndex < 0) {
      console.log("Your job is finished and off the queue.");
      setPeek(false);
      setJobStatus(STATUS.DONE);
    } else {
      console.log("Your job is waiting in queue to be processed.");
      setJobStatus(STATUS.WAITING);
    }
  }, [queueInfo.currentIndex]);

  useEffect(() => {
    let intervalId;
    if (peek) {
      // Fetch data every 1 second
      intervalId = setInterval(() => {
        fetchQueueInfo();
      }, PEEK_INTERVAL_MS);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [peek]);

  const fetchQueueInfo = () => {
    const token = sessionStorage.getItem("token");
    fetch(process.env.REACT_APP_SERVER_ADDRESS + "/files/queueSize", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setQueueInfo(data);
      });
  };

  const WaitingSpan = (
    <span>You are number {queueInfo.currentIndex} in the waiting line.</span>
  );

  const ProcessingSpan = <span>You audio is generating right now...</span>;

  const DoneSpan = (
    <span
      style={{
        /* color: "green", borderRadius: "1ch", background: "green" */
        textAlign: "center",
      }}
    >
      You generated audio is ready to be downloaded!
    </span>
  );

  return (
    <div style={{ width: "300px", overflow: "auto" }}>
      <button
        onClick={handleText}
        style={{
          width: "300px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OutboxOutlinedIcon />
        <span>Send Text</span>
      </button>
      {showInfo && (
        <div>
          {jobStatus == STATUS.WAITING && (
            <>
              <span>
                The system has {queueInfo.queueLength - 1} jobs in waiting line.
              </span>
              <br />
              <span>
                A total of {queueInfo.userCount - 1} users are in the waiting
                line.
              </span>
              <br />
            </>
          )}
          {jobStatus == STATUS.DONE
            ? DoneSpan
            : jobStatus == STATUS.PROCESSING
            ? ProcessingSpan
            : jobStatus == STATUS.WAITING
            ? WaitingSpan
            : null}
        </div>
      )}
    </div>
  );
};

QueueChecker.propTypes = {
  text: PropTypes.string.isRequired,
};

export default QueueChecker;
