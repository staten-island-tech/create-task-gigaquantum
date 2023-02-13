function pythagoreanTheoremCalc(a, b, resultType) {
  if (resultType == "base") {
    return Math.sqrt(a ** 2 + b ** 2);
  } else if (resultType == "hypotenuse") {
    return Math.sqrt(Math.abs(a ** 2 - b ** 2));
  }
}

function coordinateDistCalc(latCoordA, longCoordA, latCoordB, longCoordB) {
  // Fix distance calculation: Distance between coordinate degrees is not constant everywhere.
  let r = 0;
  const d = 2 * r * Math.asin;

  return pythagoreanTheoremCalc(
    Math.abs(latCoordA - latCoordB),
    Math.abs(longCoordA - longCoordB),
    "hypotenuse"
  );
}

// --------------------------------------------------------------------------------

// import "css/style.css";
import { apiData } from "./api.js";

apiData.then((data) => console.log(data.networks));
