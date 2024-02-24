import { useState } from "react";
import "./App.css";

import { SearchResults } from "./SearchResults";

function App() {
  const [textareaValue, setTextAreaValue] = useState();
  const [searchQuery, setSearchQuery] = useState();

  const onSearch = () => {
    setSearchQuery(textareaValue);
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

        <SearchResults searchQuery={searchQuery} />
      </header>
    </div>
  );
}

export default App;
