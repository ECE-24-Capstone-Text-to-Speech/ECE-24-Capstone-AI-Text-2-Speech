import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./MarkdownComponent.css";

import ReactMarkeDown from "react-markdown";

const img = (props) => {
  const { node, ...rest } = props;
  return <img style={{ maxWidth: "300px", borderRadius: "1ch" }} {...rest} />;
};

const MarkdownComponent = ({ name }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    let filepath = process.env.PUBLIC_URL + "/Markdown/" + name + ".md";
    fetch(filepath)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, [name]);

  return (
    <div className="MarkdownComponent">
      <ReactMarkeDown
        children={content}
        components={{
          img,
        }}
      />
    </div>
  );
};

MarkdownComponent.propTypes = {};

export default MarkdownComponent;
