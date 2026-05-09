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

function render(data) {
  document.getElementById("bigSoc").innerText = data.soc + "%";
  document.getElementById("packVoltage").innerText = data.voltage + "V";
  document.getElementById("packCurrent").innerText = data.current + "A";
  document.getElementById("power").innerText = data.power + "W";

  const cellsContainer = document.getElementById("cells");
  cellsContainer.innerHTML = "";

  const cols = 4;
  const rows = 4; // 16 cells / 4 cols

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const index = col + row * cols;
      const voltage = data.cells[index];

      cellsContainer.innerHTML += `
        <div class="cell-item">
          <div class="cell-number">${index + 1} -</div>
          <div class="cell-voltage">${voltage.toFixed(3)}V</div>
        </div>
      `;
    }
  }

  const resistancesContainer = document.getElementById("resistances");
  resistancesContainer.innerHTML = "";

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const index = col + row * cols;
      const resistance = data.resistances[index];

      resistancesContainer.innerHTML += `
        <div class="resistance-item">
          <div class="resistance-label">${index + 1} -</div>
          <div class="resistance-value">${resistance.toFixed(3)}Ω</div>
        </div>
      `;
    }
  }

  const temperaturesContainer = document.getElementById("temperatures");
  temperaturesContainer.innerHTML = "";

  data.temperatures.forEach((temp, index) => {
    temperaturesContainer.innerHTML += `
      <div class="temp-item">
        <div class="temp-label">Temp ${index + 1}</div>
        <div class="temp-value">${temp}°C</div>
      </div>
    `;
  });
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