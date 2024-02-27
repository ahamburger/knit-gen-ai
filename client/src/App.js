import { useState } from "react";
import "./App.css";

import { SearchResults } from "./SearchResults";

const placeholderList = ["cozy winter socks", "easy colorful mittens", "warm vest for my dog", "sleeveless dress", "summer top for my toddler", "complicated socks"]
const randomPlaceholder = placeholderList[Math.floor(Math.random() * placeholderList.length)]

function App() {
  const [textareaValue, setTextAreaValue] = useState();
  const [searchQuery, setSearchQuery] = useState();
  const [resultsLoading, setResultsLoading] = useState(false);
  const [errorFetchingResults, setErrorFetchingResults] = useState(false);
  const [patterns, setPatterns] = useState(undefined);
  const [ravelrySearchTerms, setRavelrySearchTerms] = useState(undefined);

  const onSearch = async () => {
    if (resultsLoading) {
      return;
    }
    setSearchQuery(textareaValue);
    setResultsLoading(true);
    setErrorFetchingResults(false);
    setPatterns(undefined);

    const fetchParams = new URLSearchParams({ input: textareaValue });
    const res = await fetch(`/search?${fetchParams}`)

    if (res.ok) {
      try {
        const { patterns, ravelrySearchTerms } = await res.json();
        // TODO add pagination
        setPatterns(patterns);
        setRavelrySearchTerms(ravelrySearchTerms);
      } catch (err) {
        setErrorFetchingResults(true);
        console.error('Error parsing res.json', err)
        setPatterns([]);
      }

    } else {
      setErrorFetchingResults(true);
      console.error('Error with search request', res.status)
      setPatterns([]);
    }

    setResultsLoading(false);
  };

  return (
    <div className="App">
      <div className="App-content">
        <h1>What do you want to knit?</h1>
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
            aria-label="Enter a description of a knitting pattern"
            placeholder={`Try "${randomPlaceholder}"`}
          />
          <button onClick={onSearch}>Search</button>
        </div>
        <SearchResults
          searchQuery={searchQuery}
          resultsLoading={resultsLoading}
          showErrorMessage={errorFetchingResults}
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
