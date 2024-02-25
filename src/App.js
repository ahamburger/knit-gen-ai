
import { useState } from "react";
import "./App.css";

import { SearchResults } from "./SearchResults";
import { searchRavelry } from "./helpers/ravelry";

function App() {
  const [textareaValue, setTextAreaValue] = useState();
  const [searchQuery, setSearchQuery] = useState();
  const [resultsLoading, setResultsLoading] = useState(false);
  const [results, setResults] = useState(undefined);

  const onSearch = () => {
    setSearchQuery(textareaValue);
    setResultsLoading(true);
    setResults(undefined);
    searchRavelry(textareaValue).then((res) => {
      // TODO add pagination
      // TODO add better types for loading/loaded state
      setResults(res.patterns);
      setResultsLoading(false);
    });
  };

  return (
    <div className="App">
      <header className="App-body">
        <p>What kind of pattern are you looking for?</p>
        <div className="Search-container">
          <textarea
            rows="4"
            cols="50"
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
