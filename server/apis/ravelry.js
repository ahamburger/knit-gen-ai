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

  for (const key in searchParameters) {
    // TODO validate that value is ok for pa, pc, and fit

    if (Array.isArray(searchParameters[key])) {
      searchParameters[key] = searchParameters[key].join("|");
    }
  }

  const parameters = new URLSearchParams({
    ...searchParameters,
    page_size: 10,
  });

  const response = await fetch(
    `${ravelryUrl}/patterns/search.json?${parameters}`,
    { method: "GET", headers: headers }
  );

  parameters.delete("page_size");
  const ravelrySearchTerms = parameters.toString();

  try {
    const { patterns } = await response.json();

    return { patterns, ravelrySearchTerms };
  } catch {
    console.error("Error parsing response from Ravelry", response.status);
    return { patterns: [], ravelrySearchTerms };
  }
}

module.exports = { searchRavelry };
