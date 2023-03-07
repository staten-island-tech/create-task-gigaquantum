import "../styles/style.css";
import { DOMSelectors } from "./DOMSelectors";
import { apiFunctions, dataFunctions } from "./functions";

dataFunctions.resetInputFields();

DOMSelectors.resetBtn.addEventListener("click", function () {
  dataFunctions.resetInputFields();
});

DOMSelectors.submitBtn.addEventListener("click", function () {
  DOMSelectors.submitBtn.disabled = true;
  DOMSelectors.resetBtn.disabled = true;

  document.querySelectorAll("tbody").forEach((element) => element.remove());

  if (
    DOMSelectors.userLatitude.value == undefined ||
    DOMSelectors.userLongitude.value == undefined ||
    DOMSelectors.searchRadius.value == 0
  ) {
    alert(
      "Please fill out all input fields and ensure the search radius is between 0 and 1000, then try again."
    );
    DOMSelectors.submitBtn.disabled = false;
    DOMSelectors.resetBtn.disabled = false;
    return;
  } else if (DOMSelectors.searchRadius.value > 1000) {
    alert(
      "Search Radius cannot be greater than 1000 KM. Please reduce the Search Radius to below 1000 KM and try again."
    );
    DOMSelectors.submitBtn.disabled = false;
    DOMSelectors.resetBtn.disabled = false;
    return;
  } else if (
    DOMSelectors.userLatitude.value > 90 ||
    DOMSelectors.userLatitude.value < -90
  ) {
    alert(
      "Latitude cannot be greater than 90 or less than -90. Please ensure the Latitude is in-range and try again."
    );
    DOMSelectors.submitBtn.disabled = false;
    DOMSelectors.resetBtn.disabled = false;
    return;
  } else if (
    DOMSelectors.userLongitude.value > 180 ||
    DOMSelectors.userLongitude.value < -180
  ) {
    alert(
      "Longitude cannot be greater than 180 or less than -180. Please ensure the Longitude is in-range and try again."
    );
    DOMSelectors.submitBtn.disabled = false;
    DOMSelectors.resetBtn.disabled = false;
    return;
  } else {
    apiFunctions.fetchAPI("https://api.citybik.es/v2/networks").then((data) => {
      let userData = {};
      userData.latitude = Number(DOMSelectors.userLatitude.value);
      userData.longitude = Number(DOMSelectors.userLongitude.value);
      userData.searchRadius = Number(DOMSelectors.searchRadius.value);

      data.networks.forEach((element) => {
        element.userDistance = dataFunctions.coordinateDistanceCalc(
          element.location.latitude,
          element.location.longitude,
          userData.latitude,
          userData.longitude
        );
      });

      /* Adds 50KM to the search radius so if the center of the Bike Station Network is farther 
      than the closest Bike station in that network, the program will still list it.*/
      dataFunctions.formatAndCheckArray(
        data.networks,
        "userDistance",
        userData.searchRadius + 50,
        "Sorry, there are no bike stations within the entered search radius. Increase the search radius and try again."
      );

      let apiCallArray = [];
      data.networks
        .filter(
          (element) => element.userDistance <= userData.searchRadius + 50
          /* Adds 50KM so if the center of the Bike Station Network is 
            farther than the closest Bike station in that network, the program 
            will still list it.*/
        )
        .forEach((filteredElement) => {
          apiCallArray.push(
            apiFunctions.fetchAPI(
              `https://api.citybik.es/v2/networks/${filteredElement.id}`
            )
          );
        });
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
          bikeStation.userDistance = dataFunctions.coordinateDistanceCalc(
            bikeStation.latitude,
            bikeStation.longitude,
            userData.latitude,
            userData.longitude
          );
        });

        const formattedBikeStationArray = dataFunctions.formatAndCheckArray(
          bikeStationArray,
          "userDistance",
          userData.searchRadius,
          "Sorry, there are no bike stations within the entered search radius. Increase the search radius and try again."
        );

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
          Your Location (KM)
        </th>
        <th>Latitude</th>
        <th>Longitude</th>
        </tr>
        `
        );

        formattedBikeStationArray.forEach((bikeStation) => {
          dataFunctions.addBikeStationRow(
            bikeStation.networkBrand,
            bikeStation.name,
            bikeStation.free_bikes,
            bikeStation.empty_slots,
            bikeStation.userDistance,
            bikeStation.latitude,
            bikeStation.longitude
          );
        });
      });
      DOMSelectors.submitBtn.disabled = false;
      DOMSelectors.resetBtn.disabled = false;
    });
  }
});
