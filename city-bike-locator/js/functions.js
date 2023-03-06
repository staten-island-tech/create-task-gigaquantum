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
  coordinateDistanceCalc: function (
    array,
    targetProperty,
    latProperty,
    longProperty,
    userLat,
    userLong,
    radius
  ) {
    if (radius <= 0) {
      console.log(
        "coordinateDistanceCalc: Invalid radius. Radius must be greater than 0"
      );
    } else {
      console.log(array);
      array.forEach((item) => {
        console.log(item);
        console.log(item["location.latitude"]);
        // Average Radius of the Earth (in Kilometers) = 6371
        // Converting the coordinates to Radians
        const radianLatCoordA = item[latProperty] * (Math.PI / 180);
        const radianLatCoordB = userLat * (Math.PI / 180);
        const radianLongCoordA = item[longProperty] * (Math.PI / 180);
        const radianLongCoordB = userLong * (Math.PI / 180);

        // Haversine Formula
        const distance =
          2 *
          radius *
          Math.asin(
            Math.sqrt(
              Math.sin((radianLatCoordB - radianLatCoordA) / 2) ** 2 +
                Math.cos(radianLatCoordA) *
                  Math.cos(radianLatCoordB) *
                  Math.sin((radianLongCoordB - radianLongCoordA) / 2) ** 2
            )
          );
        item[targetProperty] = distance;
      });
    }
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
