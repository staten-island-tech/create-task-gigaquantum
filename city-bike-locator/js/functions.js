const apiFunctions = {
  fetchAPI: async function (url) {
    try {
      const response = await fetch(url);
      if (response.status < 200 || response.status > 299) {
        console.log(response.status);
        throw Error(response.status);
      } else {
        const jsonData = await response.json();
        return await jsonData;
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
};

const dataFunctions = {
  getAPIDataFromArray: async function (data) {
    data
      .filter(
        (element) => element.location.userDistance <= DOMSelectors.searchRadius //.value
      )
      .forEach((filteredElement) => {
        apiFunctions
          .fetchAPI(`http://api.citybik.es/v2/networks/${filteredElement.id}`)
          .then((newData) => {
            console.log(newData);
            bikeStationArray = bikeStationArray.concat(newData);
          });
      })
      .then((bikeStationArray) => {
        console.log(bikeStationArray);
      });
  },
};

export { apiFunctions, dataFunctions };
