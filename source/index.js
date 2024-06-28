const btn = document.querySelector("button");
const idInput = document.querySelector(".search-bar__input");
const ipInfo = document.querySelector("#ip");
const locationInfo = document.querySelector("#location");
const timezoneInfo = document.querySelector("#timezone");
const ispInfo = document.querySelector("#isp");
let myMap = undefined;

btn.addEventListener("click", getData);
idInput.addEventListener("keydown", handleKey);

async function getData() {
  inputData = idInput.value;
  if (validateIp(inputData)) {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_hctYzT6UtwqXjbNkZPgsO4HIXWteR&ipAddress=${inputData}`
    );
    const data = await response.json();
    setInfo(data);
  }
}

function handleKey(event) {
  if (event.key == "Enter") {
    getData();
  }
}

function setInfo(data) {
  const { lat, lng, city } = data.location;
  ipInfo.innerText = data.ip;
  locationInfo.innerText = data.location.country + " " + data.location.region;
  timezoneInfo.innerText = data.location.timezone;
  ispInfo.innerText = data.isp;

  if (myMap !== undefined) {
    // myMap.geoObjects.removeAll();
    myMap.setCenter([lat, lng]);
    createPlacemark(myMap, lat, lng);
  } else {
    ymaps.ready(init());
    myMap.setCenter([lat, lng]);
    createPlacemark(myMap, city, lat, lng);
  }
}

function validateIp(ip) {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ip
    )
  ) {
    return true;
  }
  alert("Input ip-adress invalid");
  return false;
}

function init() {
  // Создание карты.
  myMap = new ymaps.Map("map", {
    center: [37.64, 55.76],
    zoom: 10,
    type: "yandex#satellite",
    controls: [],
  });
}

function createPlacemark(map, city, lat, lng) {
  let placemark = new ymaps.Placemark(
    [lat, lng],
    {
      iconContent: city,
    },
    {
      preset: "islands#yellowStretchyIcon",
      balloonCloseButton: false,
      hideIconOnBalloonOpen: false,
    }
  );
  map.geoObjects.add(placemark);
}
