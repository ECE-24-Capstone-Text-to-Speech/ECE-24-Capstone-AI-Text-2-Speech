import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import "./PopupModal.css";

const PopupModal = ({
  open,
  title,
  onClose,
  onConfirm,
  onCancel,
  children,
}) => {
  return (
    <Dialog
      className="Modal"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          style: { backdropFilter: "blur(1px)" },
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {onCancel && <button onClick={onCancel}>Cancel</button>}
        {onConfirm && (
          <button onClick={onConfirm} autoFocus>
            OK
          </button>
        )}
        {!onConfirm && !onCancel && <button onClick={onClose}>Close</button>}
      </DialogActions>
    </Dialog>
  );
};

PopupModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  //   information: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  children: PropTypes.node,
};

export default PopupModal;
