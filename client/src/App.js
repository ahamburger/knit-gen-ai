import { useState } from "react";
import "./App.css";

import { SearchResults } from "./SearchResults";

function App() {
  const [textareaValue, setTextAreaValue] = useState();
  const [searchQuery, setSearchQuery] = useState();
  const [resultsLoading, setResultsLoading] = useState(false);
  const [patterns, setPatterns] = useState(undefined);
  const [ravelrySearchTerms, setRavelrySearchTerms] = useState(undefined);

  const onSearch = async () => {
    if (resultsLoading) {
      return;
    }
    setSearchQuery(textareaValue);
    setResultsLoading(true);
    setPatterns(undefined);

    const fetchParams = new URLSearchParams({ input: textareaValue });

    try {
      const res = await fetch(`/search?${fetchParams}`);
      if (res.ok) {
        const { patterns, ravelrySearchTerms } = await res.json();
        // TODO add pagination
        // TODO add better types for loading/loaded state / error handling
        setPatterns(patterns);
        setRavelrySearchTerms(ravelrySearchTerms);
      }
    } catch (err) {
      console.error(err);
      setPatterns([]);
    }

    setResultsLoading(false);
  };

  return (
    <div className="App">
      <div className="App-content">
        <p>What do you want to knit?</p>
        <div className="Search-container">
          <textarea
            rows="4"
            cols="50"
            maxLength={200}
            value={textareaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                onSearch();
                e.preventDefault();
              }
            }}
          />
          <button onClick={onSearch}>Search</button>
        </div>
        <SearchResults
          searchQuery={searchQuery}
          resultsLoading={resultsLoading}
          results={patterns}
          ravelrySearchTerms={ravelrySearchTerms}
        />
      </div>
      <footer>
        <p>
          Made by <a href="https://github.com/ahamburger">Allison Hamburger</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
