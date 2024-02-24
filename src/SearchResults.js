export function SearchResults({ searchQuery }) {
  return (
    <div className="SearchResults">
      {searchQuery && (
        <p>
          Search results for: <i>{searchQuery}</i>
        </p>
      )}
    </div>
  );
}
