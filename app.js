//------------------------------------------------------------
//V A R I A B L E S 
//------------------------------------------------------------

const wilgotnoscDiv = document.getElementById("wilgotnosc")
const tempDiv = document.getElementById("temp")
const wodaDiv = document.getElementById("woda")

const soilMoistureFakeDiv = document.getElementById("soilMoistureFakeDiv")
const temperatureFakeDiv = document.getElementById("temperatureFakeDiv")
const waterFakeDiv = document.getElementById("waterFakeDiv")

const soilMoistureFakeDiv_1h = document.getElementById("soilMoistureFakeDiv_1h")
const temperatureFakeDiv_1h = document.getElementById("temperatureFakeDiv_1h")
const waterFakeDiv_1h = document.getElementById("waterFakeDiv_1h")

const soilMoistureFakeDiv_24h = document.getElementById("soilMoistureFakeDiv_24h")
const temperatureFakeDiv_24h = document.getElementById("temperatureFakeDiv_24h")
const waterFakeDiv_24h = document.getElementById("waterFakeDiv_24h")

var ip = 'http://localhost:8080';
var header = '2142';




const chartCanvas = document.getElementById("chart")

//------------------------------------------------------------
//W A T E R   P R O G R E S S B A R
//------------------------------------------------------------

function setWaterProgressBar() {

  fetch(ip+'/water', {
    headers: new Headers({
      "ngrok-skip-browser-warning": header
    })
  })
  .then((response) => response.json())
  .then((data) => {
    var bar1 = document.getElementById('waterProgressBar').ldBar;
    data = data.reverse()
    console.log(data)
    var waterLevel = data[0].distance;
    waterLevel = waterLevel - 96;
    console.log(waterLevel)
    bar1.set(waterLevel);
  })
}

//------------------------------------------------------------
//C H A R T S 
//------------------------------------------------------------

let chart = new Chart(chartCanvas,
  {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Wilgotność',
          data: []
        }
      ]
    }
  }
);

//------------------------------------------------------------
//D A T A   S E T S 
//------------------------------------------------------------
//frontpage data
const interval = setInterval(function(){ 
  getMoisture();
  setWaterProgressBar();
}, 9999);

//last hour data
const interval_1h = setInterval(function(){ 
  getMoisture_1h();
}, 9999);

//last 24h data
const interval_24h = setInterval(function(){ 
  getMoisture_24h();
}, 9999);


//------------------------------------------------------------
//F U N C T I O N S
//------------------------------------------------------------

//timestamp - time only
function getTimeFromTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getUTCHours() + 1;
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();

  return formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

//timestamp - time & date
function getDateAndTimeFromTimestamp(timestamp) {

  var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];

  const date = new Date(timestamp * 1000);
  const hours = date.getUTCHours() + 1;
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ' - ' + day + '/' + month + '/' + year;
}


// setting new ip when raspberry ip changes
function changeIP(){
  ip = document.getElementById("IP").value;
  console.log(ip);
}

//------------------------------------------------------------
//functions for frontpage
function getMoisture() {
  fetch(ip+'/soilMoisture', {
    headers: new Headers({
      "ngrok-skip-browser-warning": header
    })
  }) 
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    const soilMoistureData = document.createElement("div") 
    soilMoistureData.classList.add("row", "d-flex") 
    data.reverse().slice(0,10).forEach(element => {
      const timestamp = getTimeFromTimestamp(element.timestamp) 
      
      soilMoistureData.innerHTML += `<div class="row d-flex"><p class="col-4 value">${element.id}</p><p class="col-4 value">${element.humidity}</p><p class="col-4 value">${timestamp}</p></div>`
    });
    soilMoistureFakeDiv.innerHTML = soilMoistureData.innerHTML 
    data = data.reverse()
    chart.data.datasets[0].data = data.map(row => row.humidity)
    chart.data.labels = data.map(row => row.timestamp)
    chart.update()
  })
  .then(() => {
    getTemperature()
  });
}

function getTemperature() {
  fetch(ip+'/temperature', {
    headers: new Headers({
      "ngrok-skip-browser-warning": header
    })
  }) 
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    const temperatureData = document.createElement("div") 
    temperatureData.classList.add("row", "d-flex") 
    data.reverse().slice(0,10).forEach(element => {
      const timestamp = getTimeFromTimestamp(element.timestamp) 
      
      temperatureData.innerHTML += `<div class="row d-flex"><p class="col-4 value">${element.id}</p><p class="col-4 value">${element.temperature}</p><p class="col-4 value">${timestamp}</p></div>`
    });
    temperatureFakeDiv.innerHTML = temperatureData.innerHTML 
  })
  .then(() => {
    getPressure()
  })
}

function getPressure() {
  fetch(ip+'/water', {
    headers: new Headers({
      "ngrok-skip-browser-warning": header
    })
  }) 
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    const waterData = document.createElement("div") 
    waterData.classList.add("row", "d-flex") 
    data.reverse().slice(0,10).forEach(element => {
      const timestamp = getTimeFromTimestamp(element.timestamp) 
      
      waterData.innerHTML += `<div class="row d-flex"><p class="col-4 value">${element.id}</p><p class="col-4 value">${element.distance}</p><p class="col-4 value">${timestamp}</p></div>`
    });
    waterFakeDiv.innerHTML = waterData.innerHTML 
});
}

//------------------------------------------------------------
//functions for 1h data
function getMoisture_1h() {
  fetch(ip+'/soilMoisture', {
    headers: new Headers({
      "ngrok-skip-browser-warning": header
    })
  }) 
  .then((response) => response.json())
  .then((data) => {
    var soilMoistureFiltred1h = data.filter(reading => reading.id % 12 == 0)
    console.log(soilMoistureFiltred1h)
    const soilMoistureData1h = document.createElement("div") 
    soilMoistureData1h.classList.add("row", "d-flex") 
    soilMoistureFiltred1h.reverse().slice(0,30).forEach(element => {
      const timestamp = getTimeFromTimestamp(element.timestamp)
      soilMoistureData1h.innerHTML += `<div class="row d-flex"><p class="col-4 value">${element.id}</p><p class="col-4 value">${element.humidity}</p><p class="col-4 value">${timestamp}</p></div>`
      soilMoistureFakeDiv_1h.innerHTML = soilMoistureData1h.innerHTML 
    });
  })
  .then(() => {
    getTemperature_1h()
  });
}

function getTemperature_1h() {
  fetch(ip+'/temperature', {
    headers: new Headers({
      "ngrok-skip-browser-warning": header
    })
  }) 
  .then((response) => response.json())
  .then((data) => {
    var temperatureFiltred1h = data.filter(reading => reading.id % 12 == 0)
    console.log(temperatureFiltred1h)
    const temperatureData1h = document.createElement("div") 
    temperatureData1h.classList.add("row", "d-flex") 
    temperatureFiltred1h.reverse().slice(0,30).forEach(element => {
      const timestamp = getTimeFromTimestamp(element.timestamp)
      temperatureData1h.innerHTML += `<div class="row d-flex"><p class="col-4 value">${element.id}</p><p class="col-4 value">${element.temperature}</p><p class="col-4 value">${timestamp}</p></div>`
      temperatureFakeDiv_1h.innerHTML = temperatureData1h.innerHTML 
    });
  })
  .then(() => {
    getPressure_1h()
  });
}

function getPressure_1h() {
  fetch(ip+'/water', {
    headers: new Headers({
      "ngrok-skip-browser-warning": header
    })
  }) 
  .then((response) => response.json())
  .then((data) => {
    var pressureFiltred1h = data.filter(reading => reading.id % 12 == 0)
    console.log(pressureFiltred1h)
    const pressureData1h = document.createElement("div") 
    pressureData1h.classList.add("row", "d-flex") 
    pressureFiltred1h.reverse().slice(0,30).forEach(element => {
      const timestamp = getTimeFromTimestamp(element.timestamp)
      pressureData1h.innerHTML += `<div class="row d-flex"><p class="col-4 value">${element.id}</p><p class="col-4 value">${element.distance}</p><p class="col-4 value">${timestamp}</p></div>`
      waterFakeDiv_1h.innerHTML = pressureData1h.innerHTML 
    });
});
}

//------------------------------------------------------------
//functions for 24h data
function getMoisture_24h() {
  fetch(ip+'/soilMoisture', {
    headers: new Headers({
      "ngrok-skip-browser-warning": header
    })
  }) 
  .then((response) => response.json())
  .then((data) => {
    var soilMoistureFiltred24h = data.filter(reading => reading.id % 180 == 0)
    console.log(soilMoistureFiltred24h)
    const soilMoistureData24h = document.createElement("div") 
    soilMoistureData24h.classList.add("row", "d-flex") 
    soilMoistureFiltred24h.reverse().slice(0,30).forEach(element => {
      const timestamp = getDateAndTimeFromTimestamp(element.timestamp)
      soilMoistureData24h.innerHTML += `<div class="row d-flex"><p class="col-4 value">${element.id}</p><p class="col-4 value">${element.humidity}</p><p class="col-4 value">${timestamp}</p></div>`
      soilMoistureFakeDiv_24h.innerHTML = soilMoistureData24h.innerHTML 
    });
  })
  .then(() => {
    getTemperature_24h()
  });
}

function getTemperature_24h() {
  fetch(ip+'/temperature', {
    headers: new Headers({
      "ngrok-skip-browser-warning": header
    })
  }) 
  .then((response) => response.json())
  .then((data) => {
    var temperatureFiltred24h = data.filter(reading => reading.id % 180 == 0)
    console.log(temperatureFiltred24h)
    const temperatureData24h = document.createElement("div") 
    temperatureData24h.classList.add("row", "d-flex") 
    temperatureFiltred24h.reverse().slice(0,30).forEach(element => {
      const timestamp = getDateAndTimeFromTimestamp(element.timestamp)
      temperatureData24h.innerHTML += `<div class="row d-flex"><p class="col-4 value">${element.id}</p><p class="col-4 value">${element.temperature}</p><p class="col-4 value">${timestamp}</p></div>`
      temperatureFakeDiv_24h.innerHTML = temperatureData24h.innerHTML 
    });
  })
  .then(() => {
    getPressure_24h()
  });
}

function getPressure_24h() {
  fetch(ip+'/water', {
    headers: new Headers({
      "ngrok-skip-browser-warning": header
    })
  }) 
  .then((response) => response.json())
  .then((data) => {
    var pressureFiltred24h = data.filter(reading => reading.id % 180 == 0)
    console.log(pressureFiltred24h)
    const pressureData24h = document.createElement("div") 
    pressureData24h.classList.add("row", "d-flex") 
    pressureFiltred24h.reverse().slice(0,30).forEach(element => {
      const timestamp = getDateAndTimeFromTimestamp(element.timestamp)
      pressureData24h.innerHTML += `<div class="row d-flex"><p class="col-4 value">${element.id}</p><p class="col-4 value">${element.distance}</p><p class="col-4 value">${timestamp}</p></div>`
      waterFakeDiv_24h.innerHTML = pressureData24h.innerHTML 
    });
});
}