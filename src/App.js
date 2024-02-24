import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-body">
        <p>What kind of pattern are you looking for?</p>
        <div className="Search-container">
          <textarea rows="4" cols="50" />
          <button>Search</button>
        </div>
      </header>
    </div>
  );
}

export default App;
