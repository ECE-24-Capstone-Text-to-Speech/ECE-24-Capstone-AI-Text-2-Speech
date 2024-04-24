import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactMarkeDown from "react-markdown";

const renderers = {
  //This custom renderer changes how images are rendered
  //we use it to constrain the max width of an image to its container
  image: ({
      alt,
      src,
      title,
  }) => (
      <img 
          alt={alt} 
          src={src} 
          title={title} 
          style={{ maxWidth: 475 }}  />
  ),
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
    <div style={{ width: "300px" }}>
      <ReactMarkeDown children={content} components={{
    img(props) {
      const {node, ...rest} = props
      return <img style={{maxWidth: '300px', borderRadius: '1ch'}} {...rest} />
    }
  }}
 />
    </div>
  );
};

MarkdownComponent.propTypes = {};

export default MarkdownComponent;
