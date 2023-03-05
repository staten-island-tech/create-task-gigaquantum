import { DOMSelectors } from "./DOMSelectors";

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
          .fetchAPI(`https://api.citybik.es/v2/networks/${filteredElement.id}`)
          .then((newData) => {
            console.log(newData);
            bikeStationArray = bikeStationArray.concat(newData);
          });
      })
      .then((bikeStationArray) => {
        console.log(bikeStationArray);
      });
  },
  coordinateDistanceCalc: function (
    latCoordA,
    longCoordA,
    latCoordB,
    longCoordB
  ) {
    // Average Radius of the Earth (in Kilometers)
    const radius = 6371;

    // Converting the coordinates to Radians
    latCoordA = latCoordA * (Math.PI / 180);
    latCoordB = latCoordB * (Math.PI / 180);
    longCoordA = longCoordA * (Math.PI / 180);
    longCoordB = longCoordB * (Math.PI / 180);

    // Haversine Formula
    const distance =
      2 *
      radius *
      Math.asin(
        Math.sqrt(
          Math.sin((latCoordB - latCoordA) / 2) ** 2 +
            Math.cos(latCoordA) *
              Math.cos(latCoordB) *
              Math.sin((longCoordB - longCoordA) / 2) ** 2
        )
      );

    return distance;
  },
  formatArray: function (array, property, radius) {
    const sortedArray = array
      .sort((a, b) => a[property] - b[property])
      .filter((element) => element[property] <= radius);
    return sortedArray;
  },
  resetInputFields: function () {
    DOMSelectors.inputElements.forEach((element) => {
      element.value = 0;
    });
  },
  addBikeStationRow: function (
    networkBrand,
    locationName,
    availableBikes,
    emptyBikeSlots,
    distanceFromUser,
    latitude,
    longitude
  ) {
    DOMSelectors.resultTable.insertAdjacentHTML(
      "beforeend",
      `
      <tr>
          <td>${networkBrand}</td>
          <td>${locationName}</td>
          <td>${availableBikes}</td>
          <td>${emptyBikeSlots}</td>
          <td>${distanceFromUser}</td>
          <td>${latitude}</td>
          <td>${longitude}</td>
        </tr>
    `
    );
  },
};

export { apiFunctions, dataFunctions };
