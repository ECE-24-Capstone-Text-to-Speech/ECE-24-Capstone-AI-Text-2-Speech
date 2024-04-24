import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactMarkeDown from "react-markdown";

const MarkdownComponent = ({ name }) => {
  const [content, setContent] = useState("");
  useEffect(() => {
    let filepath = process.env.PUBLIC_URL + "/Markdown/" + name + ".md";
    fetch(filepath)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, [name]);
  return (
    <div style={{width: '300px'}}>
      <ReactMarkeDown children={content} />
    </div>
  );
};

MarkdownComponent.propTypes = {};

export default MarkdownComponent;
