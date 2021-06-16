import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFont,
  faUser,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import Emojizer from "../components/Emojizer";
let subscriptionKey = process.env.REACT_APP_COGNITIVE_API_KEY;
let url = "https://cognitiveservicesproject.cognitiveservices.azure.com";

function Vision() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewSrc, setImagePreviewSrc] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //styles
  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: !selectedFile
      ? "#ff8000"
      : selectedFile?.type !== "image/png"
      ? "red"
      : "green",
    color: "white",
    padding: "20px",
    margin: "0 10px",
    minWidth: "130px",
    borderRadius: "10px",
    fontSize: "16px",
    pointerEvents: "fill",
  };
  //setters
  function analyseSetter(data) {
    setTranscript(data.categories);
  }
  function ocrSetter(data) {
    setTranscript(data.regions);
  }
  function faceSetter(data) {
    setTranscript(data);
  }
  //effects
  useEffect(() => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      setImagePreviewSrc(reader.result);
      setIsFilePicked(true);
    };
  }, [selectedFile]);

  //helper functions
  async function api_call(slug, binary, setter) {
    const response = await fetch(`${url}/${slug}`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": `${subscriptionKey}`,
        "Content-type": "application/octet-stream",
      },
      body: binary,
    });
    const data = await response.json();
    setter(data);
    setIsLoading(false);
  }

  //handlers
  const changeHandler = (event) => {
    setTranscript([]);
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async (slug, setter) => {
    if (!selectedFile || selectedFile.type !== "image/png") {
      setTranscript(["Invalid PNG File"]);
      return;
    }
    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = () => {
      api_call(slug, reader.result, setter);
    };
  };

  return (
    <div className="container" style={{ backgroundColor: "#a9c0e2" }}>
      <h2>Vision API</h2>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <div className="">
          {!process.env.REACT_APP_COGNITIVE_API_KEY && (
            <h3 style={{ color: "red" }}>
              Please Provide an northeurope API Key inside .env as
              REACT_APP_COGNITIVE_API_KEY=[...]
            </h3>
          )}
          <input type="file" name="file" onChange={changeHandler} />
          {isFilePicked ? (
            <div>
              <p>Filename: {selectedFile.name}</p>
              <p
                style={{
                  color: selectedFile.type !== "image/png" ? "red" : "green",
                }}
              >
                Filetype: {selectedFile.type}
              </p>
              <p>Size in bytes: {selectedFile.size}</p>
            </div>
          ) : (
            <p>Upload an Image(.PNG) file</p>
          )}
        </div>
        {imagePreviewSrc && (
          <div className="">
            <img width="400" height="400" src={imagePreviewSrc} alt="preview" />
          </div>
        )}
      </div>
      <div style={{ display: "flex" }}>
        <button
          style={buttonStyle}
          disabled={isLoading}
          onClick={() => handleSubmission("vision/v3.1/analyze", analyseSetter)}
        >
          <FontAwesomeIcon size="lg" icon={faSearch} />
          Analyze
        </button>
        <button
          style={buttonStyle}
          disabled={isLoading}
          onClick={() => handleSubmission("vision/v3.1/ocr", ocrSetter)}
        >
          <FontAwesomeIcon size="lg" icon={faFont} />
          OCR
        </button>
        <button
          style={buttonStyle}
          disabled={isLoading}
          onClick={() => handleSubmission("face/v1.0/detect", faceSetter)}
        >
          <FontAwesomeIcon size="lg" icon={faUser} />
          Face
        </button>
        <button
          style={buttonStyle}
          disabled={isLoading}
          onClick={() =>
            handleSubmission(
              "face/v1.0/detect?returnFaceAttributes=emotion",
              faceSetter
            )
          }
        >
          <FontAwesomeIcon size="lg" icon={faSmile} />
          Emotion
        </button>
      </div>
      <div>
        <h4>Result:</h4>
        {transcript && <h5>Found {transcript.length} data</h5>}
        <div
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ecd5bb",
            borderRadius: "20px",
            marginTop: "20px",
            marginBottom: "100px",
            minHeight: "250px",
            minWidth: "500px",
          }}
        >
          {isLoading && "Loading..."}
          {transcript[0] && transcript[0]?.faceId && (
            <img src={imagePreviewSrc} alt="detected faces" />
          )}
          {transcript &&
            transcript.map((el, idx) => {
              return (
                <div key={idx}>
                  {el?.name ? ( //Analyse
                    <p>
                      Guess {idx + 1}: {el?.name} -{" "}
                      {parseFloat(el?.score).toFixed(2)}
                    </p>
                  ) : el?.boundingBox ? ( //OCR
                    el.lines.map((line, i) => {
                      let output = "";
                      line.words.map((word) => {
                        return (output += word.text + " ");
                      });
                      return (
                        <p key={i}>
                          Line {i + 1}: {output}
                        </p>
                      );
                    })
                  ) : el?.faceId && !el?.faceAttributes ? ( //Face
                    <div
                      style={{
                        position: "absolute",
                        border: "3px solid red",
                        top: el.faceRectangle?.top,
                        left: el.faceRectangle?.left,
                        width: el.faceRectangle?.width,
                        height: el.faceRectangle?.height,
                      }}
                    />
                  ) : el?.faceAttributes ? ( //Emotion
                    <div
                      role="img"
                      aria-label="emoji"
                      style={{
                        position: "absolute",
                        top: el.faceRectangle?.top,
                        left: el.faceRectangle?.left,
                        width: el.faceRectangle?.width,
                        height: el.faceRectangle?.height,
                      }}
                    >
                      <Emojizer faceAttrs={el.faceAttributes} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          {transcript[0] && transcript[0]?.faceId && (
            <h5>
              Fun fact: I was too lazy to import a library so all these squares
              are drawn by pure css :D{" "}
            </h5>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vision;
