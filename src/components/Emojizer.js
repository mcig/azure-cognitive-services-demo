import React from "react";

function Emojizer({ faceAttrs }) {
  const mood = Object.keys(faceAttrs.emotion).sort((keyA, keyB) => {
    const json = faceAttrs.emotion;
    return json[keyA] > json[keyB] ? -1 : 1;
  })[0];
  switch (mood) {
    case "anger":
      return (
        <span
          style={{ opacity: "0.3", fontSize: "80px" }}
          role="img"
          aria-label="sheep"
        >
          👿
        </span>
      );
    case "contempt":
      return (
        <span
          style={{ opacity: "0.3", fontSize: "80px" }}
          role="img"
          aria-label="sheep"
        >
          😒
        </span>
      );
    case "disgust":
      return (
        <span
          style={{ opacity: "0.3", fontSize: "80px" }}
          role="img"
          aria-label="sheep"
        >
          🤢
        </span>
      );
    case "fear":
      return (
        <span
          style={{ opacity: "0.3", fontSize: "80px" }}
          role="img"
          aria-label="sheep"
        >
          😨
        </span>
      );
    case "happiness":
      return (
        <span
          style={{ opacity: "0.3", fontSize: "80px" }}
          role="img"
          aria-label="sheep"
        >
          😁
        </span>
      );
    case "neutral":
      return (
        <span
          style={{ opacity: "0.3", fontSize: "80px" }}
          role="img"
          aria-label="sheep"
        >
          🙂
        </span>
      );
    case "sadness":
      return (
        <span
          style={{ opacity: "0.3", fontSize: "80px" }}
          role="img"
          aria-label="sheep"
        >
          😥
        </span>
      );
    case "surprise":
      return (
        <span
          style={{ opacity: "0.3", fontSize: "80px" }}
          role="img"
          aria-label="sheep"
        >
          🤯
        </span>
      );
    default:
      break;
  }
}

export default Emojizer;
