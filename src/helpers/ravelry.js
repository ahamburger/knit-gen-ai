const ravelryUsername = "read-881cd3edb850ed671d7c53fcfe2c51bd";

const ravelryUrl = "https://api.ravelry.com";

export async function searchRavelry(searchQuery) {
  const headers = new Headers();

  const ravelryKey = process.env.REACT_APP_RAVELRY_KEY;

  if (!ravelryKey) {
    throw new Error('No Ravelry key set')
  }
  
  headers.append(
    "Authorization",
    "Basic " + btoa(`${ravelryUsername}:${ravelryKey}`)
  );

  return fetch(
    `${ravelryUrl}/patterns/search.json?query=${searchQuery}&page_size=10`,
    { method: "GET", headers: headers }
  ).then((response) => response.json());
}
