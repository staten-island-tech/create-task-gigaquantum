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
    .filter((element) => bikeStation[property] <= radius);
  return sortedArray;
}

// --------------------------------------------------------------------------------

// import "css/style.css";
import { apiFunctions } from "./functions";

const apiData = apiFunctions.fetchAPI("http://api.citybik.es/v2/networks");

const userLatitude = 40.731672;
const userLongitude = -73.977477;
const searchRadius = 100;

apiData.then((data) => {
  data.networks.forEach((element) => {
    element.location.userDistance = coordinateDistanceCalc(
      element.location.latitude,
      element.location.longitude,
      userLatitude,
      userLongitude
    );
  });
  const sortedArray = data.networks.sort(
    (a, b) => a.location.userDistance - b.location.userDistance
  );
  return sortedArray;
});

console.log(sortedArray);

function addCard(distance, latitude, longitude, name, city, brand) {
  console.log(distance, latitude, longitude, name, city, brand);
  // Complete this function later
}
