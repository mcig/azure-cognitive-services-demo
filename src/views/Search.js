import { useState } from "react";
let subscriptionKey = process.env.REACT_APP_BING_API_KEY;
let url = "https://api.bing.microsoft.com/v7.0/news/search";

function Search() {
  const [searchTxt, setSearchTxt] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  function handleChange(e) {
    setSearchTxt(e.target.value);
  }
  async function handleSubmit() {
    setLoading(true);
    setSearchTxt("");
    try {
      const response = await fetch(`${url}?q=${searchTxt}`, {
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
      });
      const data = await response.json();
      setSearchResults(data.value);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }
  return (
    <div className="container" style={{ backgroundColor: "teal" }}>
      <h2>Bing News Search API</h2>
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h3>Results:</h3>
        {searchResults &&
          searchResults.slice(5).map((res) => {
            return (
              <div
                key={res.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "800px",
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
    </div>
  );
}

export default Search;
