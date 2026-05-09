const cellContainer = document.getElementById("cells");

const sampleData = {
  voltage: 52.4,
  current: -12.4,
  soc: 78,
  power: 650,
  cells: [
    3.28, 3.27, 3.29, 3.28,
    3.27, 3.28, 3.29, 3.27,
    3.28, 3.27, 3.28, 3.29,
    3.28, 3.27, 3.29, 3.28
  ],
  resistances: [
    0.012, 0.011, 0.013, 0.012,
    0.011, 0.012, 0.013, 0.011,
    0.012, 0.011, 0.012, 0.013,
    0.012, 0.011, 0.013, 0.012
  ],
  temperatures: [
    28, 31, 29, 30
  ]
};

function renderGrid(container, dataArray, cols, rows, unit, decimalPlaces = 3) {
  container.innerHTML = "";
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const index = col + row * cols;
      if (index >= dataArray.length) break;
      const value = dataArray[index];
      const formattedValue = typeof value === 'number' ? value.toFixed(decimalPlaces) : value;
      container.innerHTML += `
        <div class="cell-item">
          <div class="cell-number">${index + 1} -</div>
          <div class="cell-value">${formattedValue}${unit}</div>
        </div>
      `;
    }
  }
}

function render(data) {
  document.getElementById("bigSoc").innerText = data.soc + "%";
  document.getElementById("packVoltage").innerText = data.voltage + "V";
  document.getElementById("packCurrent").innerText = data.current + "A";
  document.getElementById("power").innerText = data.power + "W";

  const cellsContainer = document.getElementById("cells");
  renderGrid(cellsContainer, data.cells, 4, 4, 'V');

  const resistancesContainer = document.getElementById("resistances");
  renderGrid(resistancesContainer, data.resistances, 4, 4, 'Ω');

  const temperaturesContainer = document.getElementById("temperatures");
  renderGrid(temperaturesContainer, data.temperatures, 4, 1, '°C', 0);
}

function toggleCharge() {
  fetch('/charge/toggle');
}

function toggleDischarge() {
  fetch('/discharge/toggle');
}

async function fetchData() {
  try {
    const response = await fetch('/api/bms');
    const data = await response.json();

    render(data);

    document.getElementById("status").innerText = "ONLINE";
  }
  catch(e) {
    document.getElementById("status").innerText = "OFFLINE";
  }
}

render(sampleData);

setInterval(fetchData, 2000);