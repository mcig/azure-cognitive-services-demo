import { useState, useEffect } from "react";
let subscriptionKey = process.env.REACT_APP_BING_API_KEY;
let subscriptionKey2 = process.env.REACT_APP_COGNITIVE_API_KEY;
let url = "https://api.bing.microsoft.com/v7.0/news/search";
let url2 =
  "https://cognitiveservicesproject.cognitiveservices.azure.com/text/analytics/v3.1-preview.3/sentiment";

function Decision() {
  const [searchTxt, setSearchTxt] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sentimentalResults, setSentimentalResults] = useState([]);
  const [loading, setLoading] = useState(false);
  function handleChange(e) {
    setSearchTxt(e.target.value);
  }
  useEffect(() => {
    async function api_call() {
      const response2 = await fetch(`${url2}`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": `${subscriptionKey2}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          documents: searchResults.map((el, idx) => {
            return {
              language: "tr",
              id: `${idx + 1}`,
              text: `${el.description}`,
            };
          }),
        }),
      });
      const data2 = await response2.json();
      setSentimentalResults(data2.documents);
      return searchResults;
    }
    api_call();
  }, [searchResults]);

  async function handleSubmit() {
    setLoading(true);
    setSearchTxt("");
    const response = await fetch(`${url}?q=${searchTxt}`, {
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
      },
    });
    const data = await response.json();
    setSearchResults(data.value.slice(0, 3));

    setLoading(false);
  }

  return (
    <div className="container" style={{ backgroundColor: "tomato" }}>
      <h2>Decision Api Using Bing News Results</h2>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          name="text"
          placeholder="Start Typing..."
          value={searchTxt}
          onChange={(e) => handleChange(e)}
        />
        <button
          disabled={loading}
          type="button"
          name="button"
          onClick={handleSubmit}
        >
          SEARCH NOW!
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "30px",
          }}
        >
          <h3>Search Results:</h3>
          {searchResults &&
            searchResults.map((res) => {
              return (
                <div
                  key={res.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "400px",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <a href={res.url} rel="noreferrer" target="_blank">
                    {res.name}
                  </a>
                  <div
                    className="a"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    {res.image && (
                      <img
                        style={{ borderRadius: "10px", marginRight: "20px" }}
                        src={res.image?.thumbnail?.contentUrl}
                        width="100"
                        height="100"
                        alt={res.name}
                      />
                    )}
                    <p>{res.description}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3>Sentimental Analysis:</h3>
          {loading && <h4>Loading...</h4>}
          {!loading &&
            sentimentalResults &&
            sentimentalResults.map((res, idx) => {
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "400px",
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "20px",
                    minHeight: "230px",
                  }}
                >
                  {res?.sentences.map((sentence, idx) => {
                    return (
                      <div
                        key={idx}
                        className="a"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <h5 style={{ color: "tomato" }}>
                          {sentence?.sentiment}
                        </h5>
                        <p>{sentence?.text}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Decision;
