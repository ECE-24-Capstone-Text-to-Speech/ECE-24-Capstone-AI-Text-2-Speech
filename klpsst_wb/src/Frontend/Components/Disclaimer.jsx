import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PopupModal from "./PopupModal";
import MarkdownComponent from "./MarkdownComponent";

import DisclaimerMD from "../../Markdown/Disclaimer.md";
import PrivacyPolicyMD from "../../Markdown/PrivacyPolicy.md";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

const Disclaimer = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => {
          setOpen(true);
        }}
        style={{
          width: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        <PriorityHighIcon />
        <span>Disclaimer</span>
      </button>
      <div>
        <PopupModal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <MarkdownComponent path={DisclaimerMD} />
          <PrivacyPolicy />
        </PopupModal>
      </div>
    </div>
  );
};

Disclaimer.propTypes = {};

export default Disclaimer;

const PrivacyPolicy = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        Privacy policy
      </button>
      <div>
        <PopupModal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <MarkdownComponent path={PrivacyPolicyMD} />
        </PopupModal>
      </div>
    </div>
  );
};
