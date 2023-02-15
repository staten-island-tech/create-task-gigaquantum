function sineSquared(x) {
  return (1 - Math.cos(2 * x)) / 2;
}

function coordinateDistanceCalc(latCoordA, longCoordA, latCoordB, longCoordB) {
  let radius = 6371; // Average Radius of the Earth (in Kilometers)
  const distance =
    2 *
    radius *
    Math.asin(
      Math.sqrt(
        sineSquared((latCoordB - latCoordA) / 2) +
          Math.cos(latCoordA) *
            Math.cos(latCoordB) *
            sineSquared((longCoordB - longCoordA) / 2)
      )
    ); // Haversine Formula
  return distance;
}

// --------------------------------------------------------------------------------

// import "css/style.css";
import { apiFunctions } from "./functions";

const apiData = apiFunctions.fetchAPI("http://api.citybik.es/v2/networks");

let userLatitude = -74.044752;
let userLongitude = 40.689214;

apiData.then((data) => {
  console.log(data.networks);
  data.networks.forEach((element) => {
    element.location.userDistance = coordinateDistanceCalc(
      element.location.latitude,
      element.location.longitude,
      userLatitude,
      userLongitude
    );
    if (element.location.userDistance < 350) {
      console.log(element);
    }
  });
  const sortedArray = data.networks.sort(
    (a, b) => a.location.userDistance - b.location.userDistance
  ); // Array not sorting at all. Why??!!
  console.log(sortedArray);
});

function addCard(distance, latitude, longitude, name, city, brand) {
  console.log(distance, latitude, longitude, name, city, brand);
}
