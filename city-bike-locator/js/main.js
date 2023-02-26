function coordinateDistanceCalc(latCoordA, longCoordA, latCoordB, longCoordB) {
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
}

function formatArray(array, property, radius) {
  const sortedArray = array
    .sort((a, b) => a[property] - b[property])
    .filter((element) => element[property] <= radius);
  return sortedArray;
}

const DOMSelectors = {
  userLatitude: document.getElementById("latitude-input"),
  userLongitude: document.getElementById("longitude-input"),
  searchRadius: document.getElementById("distance-input"),
  submitBtn: document.getElementById("submit-btn"),
  resetBtn: document.getElementById("reset-btn"),
  inputElements: document.querySelectorAll("input"),
  resultTable: document.getElementById("result-table"),
};

function resetInputFields() {
  DOMSelectors.inputElements.forEach((element) => {
    element.value = null;
  });
}

DOMSelectors.resetBtn.addEventListener("click", function () {
  resetInputFields();
});

// ----------------------------------------------------------------------------

// import "css/style.css";
import { apiFunctions } from "./functions";

apiFunctions.fetchAPI("http://api.citybik.es/v2/networks").then((data) => {
  DOMSelectors.submitBtn.addEventListener("click", function () {
    DOMSelectors.submitBtn.disabled = true;
    DOMSelectors.resetBtn.disabled = true;

    let userData = {};
    userData.latitude = DOMSelectors.userLatitude.value;
    userData.longitude = DOMSelectors.userLongitude.value;
    userData.searchRadius = DOMSelectors.searchRadius.value;

    data.networks.forEach((element) => {
      element.location.userDistance = coordinateDistanceCalc(
        element.location.latitude,
        element.location.longitude,
        userData.latitude,
        userData.longitude
      );
    });

    DOMSelectors.resultTable.childNodes.forEach((child) => child.remove());
    let apiCallArray = [];

    if (
      data.networks.filter(
        (element) => element.location.userDistance <= userData.searchRadius
      ).length == 0
    ) {
      alert(
        "Sorry, there are no bike stations within the entered search radius. Increase the search radius and try again."
      );
      DOMSelectors.submitBtn.disabled = false;
      DOMSelectors.resetBtn.disabled = false;
      return;
    } else {
      data.networks
        .filter(
          (element) => element.location.userDistance <= userData.searchRadius //.value
        )
        .forEach((filteredElement) => {
          apiCallArray.push(
            apiFunctions.fetchAPI(
              `http://api.citybik.es/v2/networks/${filteredElement.id}`
            )
          );
        });
    }

    Promise.all(apiCallArray).then((responseArrays) => {
      let bikeStationArray = [];
      responseArrays.forEach((networkArray) => {
        networkArray.network.stations.forEach((bikeStation) => {
          bikeStation.networkBrand = networkArray.network.name;
        });
        bikeStationArray = bikeStationArray.concat(
          networkArray.network.stations
        );
      });

      bikeStationArray.forEach((bikeStation) => {
        bikeStation.userDistance = coordinateDistanceCalc(
          bikeStation.latitude,
          bikeStation.longitude,
          userData.latitude,
          userData.longitude
        );
      });

      const formattedBikeStationArray = bikeStationArray.formatArray(
        bikeStationArray,
        "userDistance",
        userData.searchRadius
      );

      if (formattedBikeStationArray.length == 0) {
        alert(
          "Sorry, there are no bike stations within the entered search radius. Increase the search radius and try again."
        );
        DOMSelectors.submitBtn.disabled = false;
        DOMSelectors.resetBtn.disabled = false;
        return;
      } else {
        DOMSelectors.resultTable.insertAdjacentHTML(
          "beforeend",
          `
        <tr>
        <th>Network Brand</th>
        <th>Location Name</th>
        <th>Available Bikes</th>
        <th>Empty Bike Slots</th>
        <th>
          Distance From <br />
          Your Location
        </th>
        <th>Latitude</th>
        <th>Longitude</th>
      </tr>
      `
        );

        formattedBikeStationArray.forEach((bikeStation) => {
          addBikeStationRow(
            bikeStation.networkBrand,
            bikeStation.name,
            bikeStation.free_bikes,
            bikeStation.empty_slots,
            bikeStation.userDistance,
            bikeStation.latitude,
            bikeStation.longitude
          );
        });
      }
    });

    DOMSelectors.submitBtn.disabled = false;
    DOMSelectors.resetBtn.disabled = false;
  });
});

// console.log(sortedArray);

function addBikeStationRow(
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
}
