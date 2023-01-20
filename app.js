const wilgotnoscDiv = document.getElementById("wilgotnosc")
const tempDiv = document.getElementById("temp")
const wodaDiv = document.getElementById("woda")

const chartCanvas = document.getElementById("chart")
const humidityrow = document.getElementById("humidityrow")

let odczyty = null

//wykres

let chart = new Chart(chartCanvas,
  {
    type: 'line',
    data: {
      labels: [], //odczyty.map(row => getDataFromTimestamp(row.timestamp)),
      datasets: [
        {
          label: 'Wilgotność',
          data: [] //odczyty.map(row => row.humidity)
        }
      ]
    }
  }
);

const interval = setInterval(function(){ 
  getMoisture();
}, 1000);

function getMoisture() {
  fetch('http://localhost:8080/soilMoisture')
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    const humiditydata = document.createElement("div") // tworzysz nowy element
    humiditydata.classList.add("row", "d-flex") // dodajesz mu klasy
    data.reverse().slice(0,10).forEach(element => {
      const timestamp = getDataFromTimestamp(element.timestamp) 
      // ↓ dodajesz treść HTML do tego utworzonego elementu
      humiditydata.innerHTML += `<div class="row d-flex"><p class="col-4">${element.id}</p><p class="col-4">${element.humidity}</p><p class="col-4">${timestamp}</p></div>`
    });
    humidityrow.innerHTML = humiditydata.innerHTML // pobierasz dummy diva i wstawiasz do niego element z danymi (podmianka boża)
    data = data.reverse()
    chart.data.datasets[0].data = data.map(row => row.humidity)
    chart.data.labels = data.map(row => row.timestamp)
    chart.update()
});
}

fetch('http://localhost:8080/temperature')
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    data.forEach(element => {
      const timestamp = getDataFromTimestamp(element.timestamp)
      tempDiv.innerHTML += `<div class="row d-flex"><p class="col-4">${element.id}</p><p class="col-4">${element.temperature}</p><p class="col-4">${timestamp}</p></div>`
    });
});

fetch('http://localhost:8080/water')
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    data.forEach(element => {
      const timestamp = getDataFromTimestamp(element.timestamp)
      wodaDiv.innerHTML += `<div class="row d-flex"><p class="col-4">${element.id}</p><p class="col-4">${element.distance}</p><p class="col-4">${timestamp}</p></div>`
    });
});

function getDataFromTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getUTCHours() + 1;
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();

  return formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}