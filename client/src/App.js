import { useState } from "react";
import "./App.css";

import { SearchResults } from "./SearchResults";

const placeholderList = ["cozy winter socks", "easy colorful mittens", "warm vest for my dog", "giant cableknit sweater", "summer top for my toddler", "complicated socks", "best striped tshirt", "drop shoulder sweater", "really thick blanket", "summery dress"]
const randomPlaceholder = placeholderList[Math.floor(Math.random() * placeholderList.length)]

const baseUrl = process.env.REACT_APP_BASE_URL || "https://knit-gen-ai-a61a595cf707.herokuapp.com"

const modelKeyToUserReadableStr = {
  "gpt-3.5-turbo-0125-function": "gpt-3.5-turbo-0125, prompt + function",
  "gpt-3.5-turbo-0125": "gpt-3.5-turbo-0125, prompt only",
  "gpt-4": "gpt-4, prompt only",
}

function App() {
  const [textareaValue, setTextAreaValue] = useState();
  const [model, setModel] = useState("gpt-3.5-turbo-0125-function");
  const [modelForLatestResults, setModelForLatestResults] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState();
  const [resultsLoading, setResultsLoading] = useState(false);
  const [errorFetchingResults, setErrorFetchingResults] = useState(false);
  const [patterns, setPatterns] = useState(undefined);
  const [suggestion, setSuggestion] = useState(undefined);
  const [explanation, setExplanation] = useState(undefined);
  const [ravelrySearchTerms, setRavelrySearchTerms] = useState(undefined);

  const onSearch = async () => {
    if (resultsLoading) {
      return;
    }
    setSearchQuery(textareaValue);
    setModelForLatestResults(model);
    setResultsLoading(true);
    setErrorFetchingResults(false);
    setPatterns(undefined);
    setExplanation(undefined);
    setSuggestion(undefined);

    const fetchParams = new URLSearchParams({ input: textareaValue, model });
    const res = await fetch(`${baseUrl}/search?${fetchParams}`)

    if (res.ok) {
      try {
        const { patterns, explanation, suggestion, ravelrySearchTerms } = await res.json();
        // TODO add pagination
        setPatterns(patterns);
        setExplanation(explanation);
        setSuggestion(suggestion);
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
          <select name="GPT model"
            value={model}
            onChange={e => setModel(e.target.value)}
          >
            {Object.keys(modelKeyToUserReadableStr).map((k) =>
              (<option value={k}>{modelKeyToUserReadableStr[k]}</option>)
            )}
          </select>
          <button onClick={onSearch}>Search</button>
        </div>

        <SearchResults
          searchQuery={searchQuery}
          resultsLoading={resultsLoading}
          showErrorMessage={errorFetchingResults}
          results={patterns}
          ravelrySearchTerms={ravelrySearchTerms}
          explanation={explanation}
          suggestion={suggestion}
          model={modelKeyToUserReadableStr[modelForLatestResults]}
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
