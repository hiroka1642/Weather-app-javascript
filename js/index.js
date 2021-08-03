//DOM
const button = document.getElementById("btn");
const lists = document.getElementById("lists");
const comment = document.getElementById("comment");
const weather = document.getElementById("weather");
const temp = document.getElementById("temperature");
const pop = document.getElementById("pop");
const icon = document.getElementById("icon");
const serch = document.getElementById("serch");
const prefectureName = document.getElementById("prefectureName");

//検索から天気を取得
async function getWeatherList(place) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${place}&id=524901&lang=ja&appid=${API_KEY}`
  );
  const weatherlist = await res.json();
  return weatherlist;
}

//現在地から天気を取得
async function getCurrentWeatherList(thislat, thislon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${thislat}&lon=${thislon}&id=524901&lang=ja&appid=${API_KEY}`
  );
  const weatherlist = await res.json();
  return weatherlist;
}

//取得した天気情報に合わせてアナウンス表示
async function showWeatherNews(getWeather) {
  const weatherlist = await getWeather;
  //降水量に対してアナウンスを表示
  if (
    weatherlist.list[0].pop <= 0.2 &&
    weatherlist.list[1].pop <= 0.2 &&
    weatherlist.list[2].pop <= 0.2
  ) {
    comment.innerText = "傘はいりません";
  } else if (
    weatherlist.list[0].pop <= 0.5 &&
    weatherlist.list[1].pop <= 0.5 &&
    weatherlist.list[2].pop <= 0.5
  ) {
    comment.innerText = "折り畳み傘を持っていこう！";
  } else {
    comment.innerText = "傘を忘れずに！";
  }

  //天気の詳細表示
  //画像表示
  switch (weatherlist.list[0].weather[0].main) {
    case "Clear":
      icon.src = "src/weather1.png";
      weather.innerText = "晴れ";

      break;
    case "Clouds":
      icon.src = "src/weather2.png";
      weather.innerText = "曇り";
      break;
    case "Rain":
      icon.src = "src/weather4.png";
      weather.innerText = "雨";

      break;
    case "Snow":
      icon.src = "src/weather5.png";
      weather.innerText = "雪";

      break;

    default:
      break;
  }
  //詳細表示
  prefectureName.innerText = weatherlist.city.name;
  temp.innerText = `${Math.floor(weatherlist.list[0].main.temp - 273.15)}℃`;
  pop.innerText = `${Math.floor(weatherlist.list[0].pop * 100)}％`;
}

//現在地を取得し、天気を表示
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    async function (pos) {
      await showWeatherNews(
        getCurrentWeatherList(pos.coords.latitude, pos.coords.longitude)
      );
    },
    function () {
      window.alert("位置情報の取得に失敗しました");
    }
  );
} else {
  window.alert("本アプリでは位置情報が使えません");
}

//現在地ボタンを押したときの処理
const currentLocation = document.getElementById("currentLocation");

currentLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(async function (pos) {
    await showWeatherNews(
      getCurrentWeatherList(pos.coords.latitude, pos.coords.longitude)
    );
  });
});

//検索ボタンをおす
serch.addEventListener("click", () => {
  const prefecturevalue = prefecture.value;
  const cityvalue = city.value;
  //市町村検索、もしくは都道府県検索
  if (city.value !== "") {
    showWeatherNews(getWeatherList(cityvalue));
  } else {
    showWeatherNews(getWeatherList(prefecturevalue));
  }
});
