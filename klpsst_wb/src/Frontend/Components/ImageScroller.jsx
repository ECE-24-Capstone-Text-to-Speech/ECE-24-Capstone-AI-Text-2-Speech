import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import Zoom from "@mui/material/Zoom";
import { Modal } from "@mui/material";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function mod(n, m) {
  return ((n % m) + m) % m;
}

const ImageScroller = ({ images }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const [showImg, setShowImg] = useState(false);
  const [zoomImg, setZoomImg] = useState({ label: null, imgPath: null });

  useEffect(() => {}, ["__INIT__"]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => mod(prevActiveStep + 1, maxSteps));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => mod(prevActiveStep - 1, maxSteps));
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleClick = (index) => {
    console.log("clicked image " + index);
    let image = images[index];
    setZoomImg(image);
    setShowImg(true);
  };

  const handleClose = () => {
    setShowImg(false);
    setZoomImg({});
  };

  return (
    <Box
      sx={{
        maxWidth: 300,
        marginBottom: 2,
        borderRadius: "1ch",
        // border: "1px solid red;",
        overflow: "inherit",
        bgcolor: "rgb(255,255,255,0.1)",
      }}
    >
      <Paper
        square
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
          bgcolor: "rgb(0,0,0,0)",
        }}
      >
        <Typography fontWeight="bold">{images[activeStep].label}</Typography>
      </Paper>
      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((step, index) => (
          <div key={step.imgPath}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                onClick={() => {
                  handleClick(index);
                }}
                component="img"
                sx={{
                  borderRadius: "10px",
                  display: "block",
                  ml: "10px",
                  mr: "10px",
                  width: "278px",
                  border: "2px solid lightgray",
                }}
                src={step.imgPath}
                alt={step.label}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        variant="dots"
        sx={{
          bgcolor: "rgb(0,0,0,0)",
          padding: "10px",
        }}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            // disabled={activeStep === maxSteps - 1}
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </Button>
        }
      />
      <PopupImage
        show={showImg}
        imgPath={zoomImg.imgPath}
        description={zoomImg.label}
        onClose={handleClose}
      />
    </Box>
  );
};

ImageScroller.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      imgPath: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ImageScroller;

const PopupImage = ({ show, imgPath, description, onClose }) => {
  return (
    <Modal open={show} onClose={onClose}>
      <Zoom in={show}>
        <img
          src={imgPath}
          alt={description}
          onClick={onClose}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "75%",
            maxHeight: "75%",
          }}
        />
      </Zoom>
    </Modal>
  );
};
