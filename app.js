window.addEventListener("load", () => {
  let long;
  let lat;
  let temeratureDescription = document.querySelector(
    ".temperature-description"
  );
  let temeratureDegree = document.querySelector(".temperature-degree");
  let locationTimeZone = document.querySelector(".location-timezone");
  let locationIcon = document.getElementById("wicon");
  let tempreatureSection = document.querySelector(".degree-section");
  const tempreatureSpan = document.querySelector(".degree-section span");

  //Si localisation activé
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const proxy = "https://cors-anywhere.herokuapp.com/";
      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=54bc753ac3234b9a073f4e57de464bfe`;

      fetch(api)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          var iconcode = data.weather[0].icon;
          var iconurl =
            "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";

          temeratureDegree.textContent = Math.floor(
            (data["main"]["temp"] * 9) / 5 - 459.67
          );

          tempreatureSpan.textContent = "F";

          temeratureDescription.textContent = data["weather"][0]["description"];

          locationTimeZone.textContent =
            data["sys"]["country"] + " - " + data["name"];

          //Icon
          locationIcon.src = iconurl;

          // F --> C
          let celsius = (temeratureDegree.textContent - 32) * (5 / 9);

          tempreatureSection.addEventListener("click", () => {
            if (tempreatureSpan.textContent === "F") {
              tempreatureSpan.textContent = "C";
              temeratureDegree.textContent = Math.floor(celsius);
            } else {
              tempreatureSpan.textContent = "F";
              temeratureDegree.textContent =
                Math.floor((data["main"]["temp"] * 9) / 5 - 459.67) + "°";
            }
          });
        });
    });
  } else {
    locationTimeZone.innerHTML =
      "Geolocation is not supported by this browser.";
  }

  function onRequestSuccess(success) {
    console.log("Successfully requested accuracy: " + success.message);
  }

  function onRequestFailure(error) {
    console.error(
      "Accuracy request failed: error code=" +
        error.code +
        "; error message=" +
        error.message
    );
    if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
      if (
        window.confirm(
          "Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?"
        )
      ) {
        cordova.plugins.diagnostic.switchToLocationSettings();
      }
    }
  }

  cordova.plugins.locationAccuracy.request(
    onRequestSuccess,
    onRequestFailure,
    cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
  );
});
