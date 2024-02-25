export function SearchResults({ searchQuery, resultsLoading, results }) {
  return (
    searchQuery && (
      <div className="SearchResults">
        <p>
          Search results for: <i>{searchQuery}</i>
        </p>
        {resultsLoading ? (
          "Loading..."
        ) : (
          <ul className="ResultsList">
            {results.map((pattern) => {
              return (
                <li key={pattern.id}>
                  {pattern.first_photo?.small_url && (
                    <img width="100px" src={pattern.first_photo?.small_url} />
                  )}
                  <a
                    href={`https://www.ravelry.com/patterns/library/${pattern.id}`}
                  >
                    {pattern.name}
                  </a>
                  {` by ${pattern.pattern_author.name}`}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    )
  );
}
