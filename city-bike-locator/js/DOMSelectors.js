const DOMSelectors = {
  userLatitude: document.getElementById("latitude-input"),
  userLongitude: document.getElementById("longitude-input"),
  searchRadius: document.getElementById("distance-input"),
  submitBtn: document.getElementById("submit-btn"),
  resetBtn: document.getElementById("reset-btn"),
  inputElements: document.querySelectorAll("input"),
  resultTable: document.getElementById("result-table"),
};

export { DOMSelectors };
