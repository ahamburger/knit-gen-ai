export function SearchResults({
  searchQuery,
  resultsLoading,
  results,
  ravelrySearchTerms,
  showErrorMessage,
  explanation,
  suggestion,
  model
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
          <p>Loading...</p>
        ) : (
          <div className="ResultsList">
            <p>
              Using Ravelry filters generated by ChatGPT ({model}): <i className="filter">{decodeURIComponent(ravelrySearchTerms)}</i>
            </p>
            <div className="context">

              {explanation && <p>{explanation}</p>}
              {suggestion && <p>{suggestion}</p>}
            </div>
            {showErrorMessage ? <p className="ErrorMessage">Error getting patterns. Please try again.</p> :
              results.length === 0 ? (
                <p>No results found</p>
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
          </div>
        )}
        {ravelryUrl && <p className="RavelryUrl"><a href={ravelryUrl}>Open on Ravelry</a></p>}
      </div>
    )
  );
}
