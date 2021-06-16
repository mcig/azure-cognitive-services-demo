import { useState } from "react";
const sdk = require("microsoft-cognitiveservices-speech-sdk");

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.REACT_APP_COGNITIVE_API_KEY || "",
  "northeurope"
);

function fromFile(file, transcriptSetter, loadingSetter) {
  loadingSetter(true);
  let audioConfig = sdk.AudioConfig.fromWavFileInput(file);
  let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizeOnceAsync((result) => {
    console.log(`RECOGNIZED: Text=${result.text}`);
    loadingSetter(false);
    transcriptSetter(result.text);
  });
}

function Speech() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    if (!selectedFile || selectedFile.type !== "audio/wav") {
      setTranscript("Invalid Audio File");
      return;
    }
    fromFile(selectedFile, setTranscript, setIsLoading);
  };

  return (
    <div className="container" style={{ backgroundColor: "wheat" }}>
      <h2>Speech API</h2>
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
              color: selectedFile.type !== "audio/wav" ? "red" : "green",
            }}
          >
            Filetype: {selectedFile.type}
          </p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{" "}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Upload a Audio (.wav) file to Get The Lyrics</p>
      )}
      <div>
        <button
          style={
            selectedFile && {
              backgroundColor:
                selectedFile.type !== "audio/wav" ? "red" : "green",
              color: "white",
            }
          }
          disabled={isLoading}
          onClick={handleSubmission}
        >
          Submit
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
          width: "400px",
        }}
      >
        Transcript: {"\n"}
        {isLoading && "Loading..."}
        {transcript}
      </div>
    </div>
  );
}

export default Speech;
