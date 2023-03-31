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
  formatAndCheckArray: function (array, property, radius, invalidMessage) {
    let formattedArray = [];
    array.forEach((element) => {
      if (element[property] <= radius) {
        formattedArray.push(element);
      }
    });

    if (formattedArray.length == 0) {
      alert(invalidMessage);
      DOMSelectors.submitBtn.disabled = false;
      DOMSelectors.resetBtn.disabled = false;
      throw `Program Execution Ended: ${invalidMessage}`;
    } else {
      formattedArray = formattedArray.sort((a, b) => a[property] - b[property]);
      return formattedArray;
    }
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
