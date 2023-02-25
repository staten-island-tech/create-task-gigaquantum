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
  userLatitude: 40.6892, // document.getElementById("latitude-input"),
  userLongitude: -74.0445, // document.getElementById("longitude-input"),
  searchRadius: 100, // document.getElementById("distance-input"),
  submitBtn: document.getElementById("submit-btn"),
  resetBtn: document.getElementById("reset-btn"),
  inputElements: document.querySelectorAll("input"),
};

function resetInputFields() {
  DOMSelectors.inputElements.forEach((element) => {
    element.value = null;
  });
}

DOMSelectors.resetBtn.addEventListener("click", function () {
  resetInputFields();
});

// --------------------------------------------------------------------------------

// import "css/style.css";
import { apiFunctions } from "./functions";

apiFunctions.fetchAPI("http://api.citybik.es/v2/networks").then((data) => {
  data.networks.forEach((element) => {
    element.location.userDistance = coordinateDistanceCalc(
      element.location.latitude,
      element.location.longitude,
      DOMSelectors.userLatitude, //.value,
      DOMSelectors.userLongitude //.value
    );
  });
  const sortedArray = data.networks.sort(
    (a, b) => a.location.userDistance - b.location.userDistance
  );

  let bikeStationArray = [];

  DOMSelectors.submitBtn.addEventListener("click", function () {
    data.networks
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
  });
});

// console.log(sortedArray);

function addCard(distance, latitude, longitude, name, city, brand) {
  console.log(distance, latitude, longitude, name, city, brand);
  // Complete this function later
}
