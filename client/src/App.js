import { useState } from "react";
import "./App.css";

import { SearchResults } from "./SearchResults";

function App() {
  const [textareaValue, setTextAreaValue] = useState();
  const [searchQuery, setSearchQuery] = useState();
  const [resultsLoading, setResultsLoading] = useState(false);
  const [results, setResults] = useState(undefined);

  const onSearch = async () => {
    if (resultsLoading) {
      return;
    }
    setSearchQuery(textareaValue);
    setResultsLoading(true);
    setResults(undefined);

    const fetchParams = new URLSearchParams({ input: textareaValue });

    try {
      const res = await fetch(`/search?${fetchParams}`);
      if (res.ok()) {
        const { patterns } = await res.json();
        // TODO add pagination
        // TODO add better types for loading/loaded state / error handling
        setResults(patterns);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
    }

    setResultsLoading(false);
  };

  return (
    <div className="App">
      <header className="App-body">
        <p>What kind of pattern are you looking for?</p>
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
          results={results}
        />
      </header>
    </div>
  );
}

export default App;
