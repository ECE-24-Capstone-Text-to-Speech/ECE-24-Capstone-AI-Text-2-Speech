import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactMarkeDown from "react-markdown";

const MarkdownComponent = ({ path }) => {
  const [content, setContent] = useState("");
  useEffect(() => {
    fetch(path)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, ["__INIT__"]);
  return (
    <div>
      <ReactMarkeDown children={content} />
    </div>
  );
};

MarkdownComponent.propTypes = {};

export default MarkdownComponent;
