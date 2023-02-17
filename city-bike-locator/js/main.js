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
        (Math.sin((latCoordB - latCoordA) / 2) ** 2) +
          (Math.cos(latCoordA) *
            Math.cos(latCoordB) *
            (Math.sin((longCoordB - longCoordA) / 2) ** 2))
      )
    );
  
  return distance;
}

// --------------------------------------------------------------------------------

// import "css/style.css";
import { apiFunctions } from "./functions";

const apiData = apiFunctions.fetchAPI("http://api.citybik.es/v2/networks");

const userLatitude = 40.731672;
const userLongitude = -73.977477;

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
  const formattedArray = data.networks.sort(
    (a, b) => a.location.userDistance - b.location.userDistance
  ).filter(bikeStation => bikeStation.location.userDistance <= searchRadius)
  console.log(formattedArray);
});

function addCard(distance, latitude, longitude, name, city, brand) {
  console.log(distance, latitude, longitude, name, city, brand);
  // Complete this function later
}
