const ravelryUsername = "read-881cd3edb850ed671d7c53fcfe2c51bd";

const ravelryUrl = "https://api.ravelry.com";

async function searchRavelry(searchParameters) {
  const headers = new Headers();

  const ravelryKey = process.env.REACT_APP_RAVELRY_KEY;

  if (!ravelryKey) {
    throw new Error("No Ravelry key set");
  }

  headers.append(
    "Authorization",
    "Basic " + btoa(`${ravelryUsername}:${ravelryKey}`)
  );

  const useCombinationInstructions = typeof searchParameters.combinationInstructions === 'object';
  console.log(searchParameters.combinationInstructions)
  for (const key in searchParameters) {
    if (Array.isArray(searchParameters[key])) {
      let joinSymbol = "|"
      if ((key ==='pa' || key === 'fit') && useCombinationInstructions && searchParameters.combinationInstructions[key] === 'AND') {
        joinSymbol = "+"
      }
      searchParameters[key] = searchParameters[key].join(joinSymbol);
    }
  }

  delete searchParameters.combinationInstructions;

  const parameters = new URLSearchParams({
    ...searchParameters, 
    craft: "knitting",
    page_size: 10,
  });

  console.log('Fetching from Ravelry with parameters', parameters)

  const response = await fetch(
    `${ravelryUrl}/patterns/search.json?${parameters}`,
    { method: "GET", headers: headers }
  );
  console.log('Received response from Ravelry')


  try {
    const { patterns } = await response.json();
    console.log(`Sending back ${patterns.length} patterns`)

    parameters.delete("page_size");
    const ravelrySearchTerms = parameters.toString();
    return { patterns, ravelrySearchTerms };
  } catch {
    throw new Error("Error parsing response from Ravelry", response.status);
  }
}

module.exports = { searchRavelry };
