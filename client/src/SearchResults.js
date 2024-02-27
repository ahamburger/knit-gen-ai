export function SearchResults({
  searchQuery,
  resultsLoading,
  results,
  ravelrySearchTerms,
  showErrorMessage
}) {
  const ravelryUrl = ravelrySearchTerms
    ? `https://www.ravelry.com/patterns/search#${ravelrySearchTerms}`
    : undefined;


  return (
    searchQuery && (
      <div className="SearchResults">
        <p>
          Search results for: <i>{searchQuery}</i>
        </p>
        {resultsLoading ? (
          "Loading..."
        ) : (
          <div className="ResultsList">
            {showErrorMessage ? <p className="ErrorMessage">Error getting patterns. Please try again.</p> :
              results.length === 0 ? (
                "No results found"
              ) : (
                <ul>
                  {results.map((pattern) => {
                    return (
                      <li key={pattern.id}>
                        {pattern.first_photo?.small_url && (
                          <img
                            width="100px"
                            src={pattern.first_photo.small_url}
                            alt={pattern.first_photo.caption || `Image of ${pattern.name}`}
                          />
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
            {ravelryUrl && <p className="RavelryUrl"> <a href={ravelryUrl}>{ravelryUrl}</a></p>}
          </div>
        )}
      </div>
    )
  );
}
