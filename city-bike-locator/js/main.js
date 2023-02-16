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
    ); // Haversine Formula: Math is incorrect. Must fix math.
  return distance;
}

// --------------------------------------------------------------------------------

// import "css/style.css";
import { apiFunctions } from "./functions";

const apiData = apiFunctions.fetchAPI("http://api.citybik.es/v2/networks");

const userLatitude = 40.731672;
const userLongitude = -73.977477;

console.log(
  coordinateDistanceCalc(
    40.6892748550208,
    -74.04457957845808,
    40.748441410666224,
    -73.98566372649938
  )
);

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
  );
  console.log(sortedArray);
});

function addCard(distance, latitude, longitude, name, city, brand) {
  console.log(distance, latitude, longitude, name, city, brand);
  // Complete this function later
}
