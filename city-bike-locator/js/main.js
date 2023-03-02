import "../styles/style.css";
import { DOMSelectors } from "./DOMSelectors";
import { apiFunctions, dataFunctions } from "./functions";

//security.mixed_content.upgrade_display_content; // Stops the browser from blocking requests from HTTP APIs (This program uses an HTTP API)

dataFunctions.resetInputFields();

DOMSelectors.resetBtn.addEventListener("click", function () {
  dataFunctions.resetInputFields();
});

DOMSelectors.submitBtn.addEventListener("click", function () {
  DOMSelectors.submitBtn.disabled = true;
  DOMSelectors.resetBtn.disabled = true;

  document.querySelectorAll("tbody").forEach((element) => element.remove());

  apiFunctions.fetchAPI("http://api.citybik.es/v2/networks").then((data) => {
    if (
      DOMSelectors.userLatitude.value == 0 ||
      DOMSelectors.userLongitude.value == 0 ||
      DOMSelectors.searchRadius.value == 0
    ) {
      if (DOMSelectors.searchRadius.value == 0) {
        alert(
          "Please fill out all input fields and ensure the search radius is greater than 0, then try again."
        );
      } else {
        alert("Please fill out all input fields and try again.");
      }
      DOMSelectors.submitBtn.disabled = false;
      DOMSelectors.resetBtn.disabled = false;
      return;
    } else {
      let userData = {};
      userData.latitude = Number(DOMSelectors.userLatitude.value);
      userData.longitude = Number(DOMSelectors.userLongitude.value);
      userData.searchRadius = Number(DOMSelectors.searchRadius.value);

      data.networks.forEach((element) => {
        element.location.userDistance = dataFunctions.coordinateDistanceCalc(
          element.location.latitude,
          element.location.longitude,
          userData.latitude,
          userData.longitude
        );
      });

      let apiCallArray = [];

      if (
        data.networks.filter(
          (element) =>
            element.location.userDistance <= userData.searchRadius + 50
          /* Adds 50KM so if the center of the Bike Station Network is farther than the closest Bike station in that network, the program will still list it.*/
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
            (element) =>
              element.location.userDistance <= userData.searchRadius + 50
            /* Adds 50KM so if the center of the Bike Station Network is farther than the closest Bike station in that network, the program will still list it.*/
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
          bikeStation.userDistance = dataFunctions.coordinateDistanceCalc(
            bikeStation.latitude,
            bikeStation.longitude,
            userData.latitude,
            userData.longitude
          );
        });

        const formattedBikeStationArray = dataFunctions.formatArray(
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
        }
      });

      DOMSelectors.submitBtn.disabled = false;
      DOMSelectors.resetBtn.disabled = false;
    }
  });
});
