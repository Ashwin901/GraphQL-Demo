const continentSelector = document.querySelector("select");
const countriesDiv = document.querySelector(".countries");

baseQuery(`
  query{
      continents{
          name
          code
      }
  }
 `).then((data) =>
  data.data.continents.forEach((continent) => {
    const option = document.createElement("option");
    option.value = continent.code;
    option.innerHTML = continent.name;
    continentSelector.append(option);
  })
);

continentSelector.addEventListener("change", async (e) => {
  const continentCode = e.target.value;
  const countries = await getCountries(continentCode);
  countriesDiv.innerHTML = "";
  countries.forEach((country) => {
    const countryElement = document.createElement("p");
    countryElement.innerHTML = country.name;
    countriesDiv.append(countryElement);
  });
});

function getCountries(continentCode) {
  return baseQuery(
    `
    query getCountries($code: ID!) {
      continent(code: $code) {
        countries {
          name
        }
      }
    }
  `,
    { code: continentCode }
  ).then((data) => data.data.continent.countries);
}

function baseQuery(query, variables) {
  return fetch("https://countries.trevorblades.com/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  }).then((res) => res.json());
}
