const ravelryUsername = "read-881cd3edb850ed671d7c53fcfe2c51bd";

const ravelryUrl = "https://api.ravelry.com";

export async function searchRavelry(searchParameters) {
  const headers = new Headers();

  const ravelryKey = process.env.REACT_APP_RAVELRY_KEY;

  if (!ravelryKey) {
    throw new Error("No Ravelry key set");
  }

  headers.append(
    "Authorization",
    "Basic " + btoa(`${ravelryUsername}:${ravelryKey}`)
  );

  const parameters = new URLSearchParams({ ...searchParameters, page_size: 10})

  const response = await fetch(
    `${ravelryUrl}/patterns/search.json?${parameters}`,
    { method: "GET", headers: headers }
  );

  return await response.json();
}
